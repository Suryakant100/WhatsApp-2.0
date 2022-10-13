const getRecipientEmail = (users, userLoggedIn) =>
  users?.filter((userToFilter) => userToFilter !== userLoggedIn?.email)[0];

// console.log(getRecipientEmail());
export default getRecipientEmail;
