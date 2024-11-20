const { FieldTypes } = require("@prisma/client");
const prisma = require("../prisma/client");
const { defaultCategories } = require("../utils/categories.utils");
const { parseExtraFields } = require("../utils/common.utils");

const createDefaultCategories = async (userId) => {
  defaultCategories.forEach(async (category) => {
    const cat = await prisma.category.create({
      data: {
        name: category.name,
        maxFields: category.maxFields,
        icon: category.icon,
        allowExtraFields: category.allowExtraFields,
        isDefault: category.isDefault,
        title: category.title,
        description: category.description,
        cover: category.image,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    if (category.fields && category.fields.length > 0) {
      const fields = category.fields.sort((a, b) => a.order - b.order);

      fields.forEach(async (field) => {
        delete field.order;

        await prisma.field.create({
          data: {
            ...field,
            category: {
              connect: {
                id: cat.id,
              },
            },
          },
        });
      });
    }
  });
};

const getCategories = async (userId) => {
  return await prisma.category.findMany({
    where: {
      userId,
    },
  });
};

// **New Function**: Search categories by name
const searchCategories = async (query, userId) => {
  return await prisma.category.findMany({
    where: {
      userId,
      name: {
        contains: query, // case-insensitive search by category name
        mode: "insensitive", // Make search case-insensitive
      },
    },
  });
};

const getCategory = async (userId, id) => {
  const category = await prisma.category.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      fields: true,
    },
  });

  if (category) {
    const fieldTypeMap = await getFieldTypeMap();
    category.fields.map((field) => {
      field.inputType = fieldTypeMap[field.type];
    });
  }

  return category;
};

const getField = async (categoryId, id) => {
  const field = await prisma.field.findFirst({
    where: {
      id,
      categoryId,
    },
  });

  if (field.type === FieldTypes.Enum) {
    field.options = field.options.join(", ");
  }

  return field;
};

const getCategoryData = async (categoryId) => {
  const data = await prisma.categoryData.findMany({
    where: {
      categoryId,
    },
  });

  if (data) {
    data.map((d) => {
      d.data = JSON.parse(d.data);
    });
  }

  return data;
};

const getCategoryDataById = async (categoryId, id) => {
  const data = await prisma.categoryData.findFirst({
    where: {
      id,
      categoryId,
    },
  });

  if (data) {
    data.data = JSON.parse(data.data);
  }

  return data;
};

const deleteCategory = async (userId, id) => {
  return await prisma.category.delete({
    where: {
      id,
      userId,
    },
  });
};

const deleteField = async (categoryId, id) => {
  return await prisma.field.delete({
    where: {
      id,
      categoryId,
    },
  });
};

const deleteCategoryData = async (categoryId, id) => {
  return await prisma.categoryData.delete({
    where: {
      id,
      categoryId,
    },
  });
};

const upsertCategory = async (userId, data) => {
  const id = data.id ? data.id : "";
  if (data.id) delete data.id;

  data.allowExtraFields = data.allowExtraFields === "1";

  return await prisma.category.upsert({
    where: {
      id,
    },
    create: {
      ...data,
      maxFields: parseInt(data.maxFields),
      user: { connect: { id: userId } },
    },
    update: {
      ...data,
      maxFields: parseInt(data.maxFields),
    },
  });
};

const upsertField = async (data) => {
  const id = data.id ? data.id : "";
  if (data.id) delete data.id;

  const categoryId = data.categoryId;
  if (data.categoryId) delete data.categoryId;

  if (data.type === FieldTypes.Enum) {
    data.options = data.options.split(",").map((option) => option.trim());
  }

  data.key = data.name.toLowerCase().replace(/ /g, "_");
  data.isRequired = data.isRequired === "1";

  return await prisma.field.upsert({
    where: {
      id,
    },
    create: {
      ...data,
      category: { connect: { id: categoryId } },
    },
    update: {
      ...data,
    },
  });
};

const upsertData = async (categoryId, data, files) => {
  const id = data.id ? data.id : "";
  if (data.id) delete data.id;

  const existingData = await getCategoryDataById(categoryId, id);

  const fields = await prisma.field.findMany({
    where: {
      categoryId,
    },
  });

  const extras = parseExtraFields(data);

  if (extras) {
    data.extras = extras;
  }

  for (const field of fields) {
    if (field.type === FieldTypes.Image || field.type === FieldTypes.Document) {
      if (files && files.length > 0) {
        for (const file of files) {
          if (file.fieldname === field.key) {
            data[field.key] = file.filename;
          } else {
            data[field.key] = existingData ? existingData.data[field.key] : "";
          }
        }
      } else {
        data[field.key] = existingData ? existingData.data[field.key] : "";
      }
      continue;
    }

    if (field.type === FieldTypes.Boolean) {
      data[field.key] = data[field.key] === "1";
    }
  }

  return await prisma.categoryData.upsert({
    where: {
      id,
    },
    create: {
      categoryId,
      data: JSON.stringify(data),
    },
    update: {
      data: JSON.stringify(data),
    },
  });
};

const getFieldTypes = async () => {
  return [
    { label: "Text", value: FieldTypes.Text },
    { label: "Number", value: FieldTypes.Number },
    { label: "Date", value: FieldTypes.Date },
    { label: "Time", value: FieldTypes.Time },
    { label: "Date & Time", value: FieldTypes.DateTime },
    { label: "Checkbox", value: FieldTypes.Boolean },
    { label: "Select", value: FieldTypes.Enum },
    { label: "Image", value: FieldTypes.Image },
    { label: "Document", value: FieldTypes.Document },
  ];
};

const getFieldTypeMap = async () => {
  return {
    [FieldTypes.Text]: "text",
    [FieldTypes.Number]: "number",
    [FieldTypes.Date]: "date",
    [FieldTypes.Time]: "time",
    [FieldTypes.DateTime]: "datetime-local",
    [FieldTypes.Boolean]: "checkbox",
    [FieldTypes.Enum]: "select",
    [FieldTypes.Image]: "file",
    [FieldTypes.Document]: "file",
  };
};

module.exports = {
  getCategories,
  createDefaultCategories,
  getCategoryData,
  getCategoryDataById,
  getCategory,
  getField,
  deleteCategory,
  deleteCategoryData,
  deleteField,
  upsertCategory,
  upsertField,
  upsertData,
  getFieldTypes,
  searchCategories, // Export the new searchCategories function
};
