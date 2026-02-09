let profile = "";
const ACTIONS_KEY = "wuActions";

export const registerProfile = (newProfile) => {
  profile = newProfile;
};

export const registerAction = (actionName, actionElement, comment) => {
  const date = new Date();
  const timestamp = date.getTime();
  const action = {
    name: actionName,
    element: actionElement,
    comment: comment,
    profile: profile,
    timestamp: timestamp,
  };
  
  const currentActions = localStorage.getItem(ACTIONS_KEY) || "";
  // Check if we need to add a comma (if string is not empty)
  const separator = currentActions ? "," : "";
  localStorage.setItem(ACTIONS_KEY, currentActions + separator + JSON.stringify(action));
};
