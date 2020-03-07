// Volunteer Example
let volunteer = {
  name: "Nikhil Wadekar",
  email: "nikhilrwadekar@gmail.com",
  password: "password",
  // Should be a Buffer to Store the Image!
  profile_picture_url: "",
  contact_number: 9876543210,
  role: "volunteer",
  tasks: {
    type: [
      {
        job_type: "Cooking",
        date: "2020-03-01T06:52:57.766Z",
        location: "157, W 49th Ave, Vancouver, BC, CA - V5Y2Z7"
      }
    ]
  },

  address: {
    street: "157, W 49th Ave",
    city: "Vancouver",
    country: "Canada",
    province: "British Columbia",
    postal_code: "V5Y2Z7"
  },
  preferences: {
    volunteering_type: ["Cooking", "Driving"],
    additional_skills: ["Consoling"]
  },
  availability: {
    type: "anytime",
    schedule: []
  }
};

// Admin Example

let admin = {
  name: "Angel Augustine",
  email: "angel.pazhalinath@gmail.com",
  password: "password",
  role: "admin",
  address: {
    street: "66, W 63rd Ave",
    city: "Vancouver",
    country: "Canada",
    province: "British Columbia",
    postal_code: "V5Y2Z7"
  }
};
