const validationItems = {
  user: {
    createUser: [
      {
        key: "username",
        rules: [
          {
            length: 2,
            validationMessage: "Your username must be more than 6 characters",
          },
        ],
        message: "You must provide a username.",
      },
      {
        key: "password",
        rules: [
          {
            length: 2,
            validationMessage: "Your password must be more than 6 characters",
          },
        ],
        message: "You must provide a password.",
      },
      {
        key: "first_name",
        rules: [],
        message: "You must provide your first name.",
      },
      {
        key: "last_name",
        rules: [],
        message: "You must provide your last name.",
      },
    ],
  },
};

export default validationItems;
