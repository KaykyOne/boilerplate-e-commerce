import { MedusaContainer } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  createCollectionsWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductOptionsWorkflow,
  createProductTagsWorkflow,
  createProductTypesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createStoresWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function initial_data_seed({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(
    ModuleRegistrationName.FULFILLMENT
  );

  const countries = ["gb", "de", "dk", "se", "fr", "es", "it"];

  const { data: existingNerdCategories } = await query.graph({
    entity: "product_category",
    fields: ["id"],
    filters: { name: "Trading Cards" },
  })

  if (existingNerdCategories.length) {
    logger.info("Nerd catalog preset already exists. Skipping seed.")
    return
  }

  logger.info("Seeding store data...");
  const { data: existingSalesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
    filters: { name: "Default Sales Channel" },
  })
  let defaultSalesChannelId = existingSalesChannels[0]?.id

  if (!defaultSalesChannelId) {
    const { result } = await createSalesChannelsWorkflow(container).run({
      input: {
        salesChannelsData: [
          {
            name: "Default Sales Channel",
            description: "Created by Medusa",
          },
        ],
      },
    })
    defaultSalesChannelId = result[0].id

    const {
      result: [publishableApiKey],
    } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [
          {
            title: "Default Publishable API Key",
            type: "publishable",
            created_by: "",
          },
        ],
      },
    })

    await linkSalesChannelsToApiKeyWorkflow(container).run({
      input: {
        id: publishableApiKey.id,
        add: [defaultSalesChannelId],
      },
    })
  }

  const { data: stores } = await query.graph({
    entity: "store",
    fields: ["id"],
  })

  if (!stores.length) {
    await createStoresWorkflow(container).run({
      input: {
        stores: [
          {
            name: "Default Store",
            supported_currencies: [
              {
                currency_code: "eur",
                is_default: true,
              },
              {
                currency_code: "usd",
                is_default: false,
              },
            ],
            default_sales_channel_id: defaultSalesChannelId,
          },
        ],
      },
    })
  }

  logger.info("Seeding region data...");
  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name"],
    filters: { name: "Europe" },
  })
  let regionId = regions[0]?.id

  if (!regionId) {
    const { result } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "Europe",
            currency_code: "eur",
            countries,
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    })
    regionId = result[0].id
  }
  logger.info("Finished seeding regions.");

  logger.info("Seeding tax regions...");
  if (!regions.length) {
    await createTaxRegionsWorkflow(container).run({
      input: countries.map((country_code) => ({
        country_code,
        provider_id: "tp_system",
      })),
    })
  }
  logger.info("Finished seeding tax regions.");

  logger.info("Seeding stock location data...");
  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
    filters: { name: "European Warehouse" },
  })
  let stockLocationId = stockLocations[0]?.id

  if (!stockLocationId) {
    const { result } = await createStockLocationsWorkflow(container).run({
      input: {
        locations: [
          {
            name: "European Warehouse",
            address: {
              city: "Copenhagen",
              country_code: "DK",
              address_1: "",
            },
          },
        ],
      },
    })
    stockLocationId = result[0].id

    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocationId,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_provider_id: "manual_manual",
      },
    })
  }

  logger.info("Seeding fulfillment data...");
  // This is created by a migration script in core.
  const { data: shippingProfileResult } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  });
  const shippingProfile = shippingProfileResult[0];

  const { data: fulfillmentSets } = await query.graph({
    entity: "fulfillment_set",
    fields: ["id", "name", "service_zones.id"],
    filters: { name: "European Warehouse delivery" },
  })
  let fulfillmentSetId = fulfillmentSets[0]?.id
  let serviceZoneId = fulfillmentSets[0]?.service_zones?.[0]?.id

  if (!fulfillmentSetId || !serviceZoneId) {
    const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
      name: "European Warehouse delivery",
      type: "shipping",
      service_zones: [
        {
          name: "Europe",
          geo_zones: countries.map((country_code) => ({
            country_code,
            type: "country" as const,
          })),
        },
      ],
    })
    fulfillmentSetId = fulfillmentSet.id
    serviceZoneId = fulfillmentSet.service_zones[0].id

    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocationId,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_set_id: fulfillmentSetId,
      },
    })
  }

  const { data: shippingOptions } = await query.graph({
    entity: "shipping_option",
    fields: ["id"],
    filters: { name: "Standard Shipping" },
  })

  if (!shippingOptions.length) {
    await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: serviceZoneId,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Ship in 2-3 days.",
          code: "standard",
        },
        prices: [
          {
            currency_code: "usd",
            amount: 10,
          },
          {
            currency_code: "eur",
            amount: 10,
          },
          {
            region_id: regionId,
            amount: 10,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
      {
        name: "Express Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: serviceZoneId,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Ship in 24 hours.",
          code: "express",
        },
        prices: [
          {
            currency_code: "usd",
            amount: 10,
          },
          {
            currency_code: "eur",
            amount: 10,
          },
          {
            region_id: regionId,
            amount: 10,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
    })
  }
  logger.info("Finished seeding fulfillment data.");

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocationId,
      add: [defaultSalesChannelId],
    },
  });
  logger.info("Finished seeding stock location data.");

  logger.info("Seeding product data...");

  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        { name: "Trading Cards", is_active: true },
        { name: "Figures", is_active: true },
        { name: "Tabletop", is_active: true },
        { name: "Collector Gear", is_active: true },
      ],
    },
  })

  const { result: productTypes } = await createProductTypesWorkflow(
    container
  ).run({
    input: {
      product_types: [
        { value: "Trading Cards" },
        { value: "Collectible Figures" },
        { value: "Tabletop Accessories" },
      ],
    },
  })

  const { result: productTags } = await createProductTagsWorkflow(container).run(
    {
      input: {
        product_tags: [
          { value: "Anime" },
          { value: "Booster Box" },
          { value: "Booster Pack" },
          { value: "Dice" },
          { value: "Fantasy" },
          { value: "Limited Edition" },
          { value: "RPG" },
          { value: "Sci-Fi" },
          { value: "Starter Deck" },
        ],
      },
    }
  )

  const { result: productOptionsResult } = await createProductOptionsWorkflow(
    container
  ).run({
    input: {
      product_options: [
        {
          title: "Format",
          values: [
            "Booster Pack",
            "Booster Box",
            "Starter Deck",
            "Figure",
            "Dice Set",
          ],
        },
      ],
    },
  })

  const formatOption = productOptionsResult.find(
    (option) => option.title === "Format"
  )!
  const categoryId = (name: string) =>
    categoryResult.find((category) => category.name === name)!.id
  const typeId = (value: string) =>
    productTypes.find((type) => type.value === value)!.id
  const tagIds = (...values: string[]) =>
    productTags
      .filter((tag) => values.includes(tag.value))
      .map((tag) => tag.id)
  const productSalesChannels = [{ id: defaultSalesChannelId }]
  const prices = (eur: number, usd: number) => [
    { amount: eur, currency_code: "eur" },
    { amount: usd, currency_code: "usd" },
  ]

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Arcane Clash Booster Pack",
          description:
            "A sealed fantasy card-game booster packed with heroes, relics, and arcane surprises.",
          handle: "arcane-clash-booster-pack",
          category_ids: [categoryId("Trading Cards")],
          type_id: typeId("Trading Cards"),
          tag_ids: tagIds("Booster Pack", "Fantasy"),
          weight: 30,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ id: formatOption.id }],
          variants: [
            {
              title: "Booster Pack",
              sku: "ARCANE-BOOSTER-PACK",
              options: { Format: "Booster Pack" },
              prices: prices(6, 7),
            },
          ],
          sales_channels: productSalesChannels,
        },
        {
          title: "Dragon Vault Booster Box",
          description:
            "A factory-sealed display box created for collectors, draft nights, and treasure hunters.",
          handle: "dragon-vault-booster-box",
          category_ids: [categoryId("Trading Cards")],
          type_id: typeId("Trading Cards"),
          tag_ids: tagIds("Booster Box", "Fantasy", "Limited Edition"),
          weight: 700,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ id: formatOption.id }],
          variants: [
            {
              title: "Booster Box",
              sku: "DRAGON-VAULT-BOX",
              options: { Format: "Booster Box" },
              prices: prices(109, 119),
            },
          ],
          sales_channels: productSalesChannels,
        },
        {
          title: "Galactic Rivals Starter Deck",
          description:
            "A ready-to-play sci-fi deck with a balanced roster and everything needed for a first duel.",
          handle: "galactic-rivals-starter-deck",
          category_ids: [categoryId("Trading Cards")],
          type_id: typeId("Trading Cards"),
          tag_ids: tagIds("Starter Deck", "Sci-Fi"),
          weight: 240,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ id: formatOption.id }],
          variants: [
            {
              title: "Starter Deck",
              sku: "GALACTIC-STARTER-DECK",
              options: { Format: "Starter Deck" },
              prices: prices(24, 27),
            },
          ],
          sales_channels: productSalesChannels,
        },
        {
          title: "Crimson Ronin Collector Figure",
          description:
            "A display-ready anime-inspired warrior figure with detailed armor and a numbered base.",
          handle: "crimson-ronin-collector-figure",
          category_ids: [categoryId("Figures")],
          type_id: typeId("Collectible Figures"),
          tag_ids: tagIds("Anime", "Limited Edition"),
          weight: 850,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ id: formatOption.id }],
          variants: [
            {
              title: "Figure",
              sku: "CRIMSON-RONIN-FIGURE",
              options: { Format: "Figure" },
              prices: prices(84, 92),
            },
          ],
          sales_channels: productSalesChannels,
        },
        {
          title: "Dungeon Master Resin Figure",
          description:
            "A richly sculpted fantasy miniature designed for the shelf or the center of a campaign table.",
          handle: "dungeon-master-resin-figure",
          category_ids: [categoryId("Figures"), categoryId("Tabletop")],
          type_id: typeId("Collectible Figures"),
          tag_ids: tagIds("Fantasy", "RPG"),
          weight: 320,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ id: formatOption.id }],
          variants: [
            {
              title: "Figure",
              sku: "DUNGEON-MASTER-FIGURE",
              options: { Format: "Figure" },
              prices: prices(42, 46),
            },
          ],
          sales_channels: productSalesChannels,
        },
        {
          title: "Blacksmith Metal Dice Set",
          description:
            "A weighty seven-piece RPG dice set finished in obsidian black with antique-gold numbering.",
          handle: "blacksmith-metal-dice-set",
          category_ids: [categoryId("Tabletop"), categoryId("Collector Gear")],
          type_id: typeId("Tabletop Accessories"),
          tag_ids: tagIds("Dice", "RPG", "Fantasy"),
          weight: 280,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ id: formatOption.id }],
          variants: [
            {
              title: "Dice Set",
              sku: "BLACKSMITH-DICE-SET",
              options: { Format: "Dice Set" },
              prices: prices(39, 43),
            },
          ],
          sales_channels: productSalesChannels,
        },
      ],
    },
  })
  logger.info("Finished seeding product data.")

  logger.info("Seeding inventory levels.");

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });
  const { data: existingInventoryLevels } = await query.graph({
    entity: "inventory_level",
    fields: ["inventory_item_id"],
  })
  const inventoryItemIdsWithLevels = new Set(
    existingInventoryLevels.map((level) => level.inventory_item_id)
  )
  const newInventoryItems = inventoryItems.filter(
    (item) => !inventoryItemIdsWithLevels.has(item.id)
  )

  if (newInventoryItems.length) {
    await createInventoryLevelsWorkflow(container).run({
      input: {
        inventory_levels: newInventoryItems.map((item, index) => ({
          location_id: stockLocationId,
          stocked_quantity: index % 5 === 0 ? 0 : 25,
          inventory_item_id: item.id,
        })),
      },
    })
  }

  logger.info("Finished seeding inventory levels data.");
}
