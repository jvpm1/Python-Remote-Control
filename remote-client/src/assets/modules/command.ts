export interface Commands {
  element: Element;
  type: string;
}

interface CommandResult {
  buttons: Commands[];
  toggles: Commands[];
}

const format = (elements: HTMLCollectionOf<Element>): Commands[] => {
  const result: Commands[] = [];
  const length = elements.length;

  for (let i = 0; i < length; i++) {
    const element = elements[i];
    if (element instanceof Element) {
      result.push({
        element,
        type: element.id || "",
      });
    }
  }

  return result;
};

export const getCommands = (): Promise<CommandResult> => {
  return new Promise((resolve) => {
    const eventButtons = document.getElementsByClassName("socket-event-button");
    const eventToggle = document.getElementsByClassName("socket-event-toggle");

    resolve({
      buttons: format(eventButtons),
      toggles: format(eventToggle),
    });
  });
};
