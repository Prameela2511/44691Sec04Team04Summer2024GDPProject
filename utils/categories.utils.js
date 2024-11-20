const { FieldTypes } = require("@prisma/client");
const { or } = require("ajv/dist/compile/codegen");

const defaultCategories = [
  {
    name: "Travel",
    maxFields: 8,
    icon: "ti-plane-tilt",
    allowExtraFields: true,
    isDefault: true,
    title: "Travel",
    description: "Jobs are essential for both individuals and society, providing opportunities for personal growth and contributing to the functioning of communities. They come in various forms and sectors, offering a range of duties and responsibilities. Ultimately, jobs play a significant role in our lives and the economy. 💼💪🌟Travel tracking is like a digital scrapbook, capturing every step of your adventures. It helps you organize trips, remember every place, and plan even better ones ahead. Plus, it's great for sharing your journey and picking up tips along the way! 🌍✈️📱.",
    image: "travel.jpg",
    fields: [
      {
        name: "Start Date",
        key: "start_date",
        type: FieldTypes.Date,
        isRequired: true,
        order: 1,
      },
      {
        name: "End Date",
        key: "end_date",
        type: FieldTypes.Date,
        isRequired: true,
        order: 2,
      },
      {
        name: "Accommodation",
        key: "accommodation",
        type: FieldTypes.Text,
        isRequired: true,
        order: 3,
      },
      {
        name: "Activity",
        key: "activity",
        type: FieldTypes.Text,
        isRequired: false,
        order: 4,
      },
      {
        name: "Place",
        key: "place",
        type: FieldTypes.Text,
        isRequired: false,
        order: 5,
      },
      {
        name: "Amount",
        key: "amount",
        type: FieldTypes.Number,
        isRequired: true,
        order: 6,
      },
      {
        name: "Transport Mode",
        key: "transport_mode",
        type: FieldTypes.Enum,
        options: ["Air", "Bus", "Train", "Car", "Bike", "Walk"],
        isRequired: true,
        order: 7,
      },
      {
        name: "Memory",
        key: "memory",
        type: FieldTypes.Image,
        isRequired: false,
        order: 8,
      },
    ],
  },
  {
    name: "Job",
    maxFields: 5,
    icon: "ti-briefcase-2",
    allowExtraFields: true,
    isDefault: true,
    title: "Job",
    description: "Job category to store your job details.",
    image: "job.jpg",
    fields: [
      {
        name: "Job Name",
        key: "job_name",
        type: FieldTypes.Text,
        isRequired: true,
        order: 1,
      },
      {
        name: "Schedule",
        key: "schedule",
        type: FieldTypes.Text,
        isRequired: true,
        order: 2,
      },
      {
        name: "Job Type",
        key: "job_type",
        type: FieldTypes.Text,
        isRequired: true,
        order: 3,
      },
      {
        name: "Salary",
        key: "salary",
        type: FieldTypes.Number,
        isRequired: true,
        order: 4,
      },
      {
        name: "Qualification",
        key: "qualification",
        type: FieldTypes.Text,
        isRequired: true,
        order: 5,
      },
    ],
  },
  {
    name: "Health",
    maxFields: 6,
    icon: "ti-heartbeat",
    allowExtraFields: true,
    isDefault: true,
    title: "Health",
    description: "Health category to store your health details.",
    image: "health.jpg",
    fields: [
      {
        name: "Status",
        key: "status",
        type: FieldTypes.Enum,
        options: ["Healthy", "Unwell", "Recovering"],
        isRequired: true,
        order: 1,
      },
      {
        name: "Doctor Information",
        key: "doctor_info",
        type: FieldTypes.Text,
        isRequired: true,
        order: 2,
      },
      {
        name: "Insurance",
        key: "insurance",
        type: FieldTypes.Boolean,
        isRequired: false,
        order: 3,
      },
      {
        name: "Next Appointment",
        key: "next_appointment",
        type: FieldTypes.DateTime,
        isRequired: true,
        order: 4,
      },
      {
        name: "Medicine",
        key: "medicine",
        type: FieldTypes.Text,
        isRequired: true,
        order: 5,
      },
      {
        name: "Nutrition",
        key: "nutrition",
        type: FieldTypes.Text,
        isRequired: true,
        order: 6,
      },
    ],
  },
  {
    name: "Movies",
    maxFields: 5,
    icon: "ti-movie",
    allowExtraFields: true,
    isDefault: true,
    title: "Movies",
    description: "Movies category to store your movie reviews.",
    image: "movies.jpg",
    fields: [
      {
        name: "Name",
        key: "name",
        type: FieldTypes.Text,
        isRequired: true,
        order: 1,
      },
      {
        name: "Location",
        key: "location",
        type: FieldTypes.Text,
        isRequired: true,
        order: 2,
      },
      {
        name: "Rating",
        key: "rating",
        type: FieldTypes.Number,
        isRequired: true,
        order: 3,
      },
      {
        name: "Review",
        key: "review",
        type: FieldTypes.Text,
        isRequired: true,
        order: 4,
      },
    ],
  },
  {
    name: "Music",
    maxFields: 5,
    icon: "ti-music",
    allowExtraFields: true,
    isDefault: true,
    title: "Music",
    description: "Music category to store your music collection.",
    image: "music.jpg",
    fields: [
      {
        name: "Title",
        key: "title",
        type: FieldTypes.Text,
        isRequired: true,
        order: 1,
      },
      {
        name: "Artist",
        key: "artist",
        type: FieldTypes.Text,
        isRequired: true,
        order: 2,
      },
      {
        name: "Album",
        key: "album",
        type: FieldTypes.Text,
        isRequired: false,
        order: 3,
      },
      {
        name: "Genre",
        key: "genre",
        type: FieldTypes.Text,
        isRequired: false,
        order: 4,
      },
      {
        name: "Release Date",
        key: "release_date",
        type: FieldTypes.Date,
        isRequired: false,
        order: 5,
      },
    ],
  },
];

const createSchema = async (category) => {
  const schema = {
    type: "object",
    properties: {},
    required: [],
    additionalProperties: true,
  };

  for (const field of category.fields) {
    if (field.type === FieldTypes.Image || field.type === FieldTypes.Document) {
      continue;
    }

    if (!schema.properties[field.key]) {
      schema.properties[field.key] = {
        type: "string",
      };

      if (field.isRequired) {
        schema.required.push(field.key);
      }
    }
  }

  return schema;
};
module.exports = {
  createSchema,
  defaultCategories,
};
