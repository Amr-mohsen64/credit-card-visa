const expirationSelect = document.querySelector("[data-expiration-year]");
const currentYear = new Date().getFullYear();
const logo = document.querySelector("[data-logo]");

for (let i = currentYear; i < currentYear + 10; i++) {
  const option = document.createElement("option");
  option.value = i;
  option.innerText = i;
  expirationSelect.append(option);
}

document.addEventListener("keydown", (e) => {
  const input = e.target;
  const key = e.key;
  // if we not in inputs
  if (!isConnectedInput(input)) return;

  switch (key) {
    case "ArrowLeft":
      if (input.previousElementSibling == null) return;
      if (input.selectionStart === 0 && input.selectionEnd === 0) {
        // the selection of input on the start [cursor]
        const prev = input.previousElementSibling;
        prev.focus();
        prev.setSelectionRange(prev.value.length - 1, prev.value.length - 1);
        e.preventDefault();
      }
      break;
    case "ArrowRight":
      if (input.nextElementSibling == null) return;
      // the selection of input on the start [cursor]
      if (
        input.selectionStart === input.value.length &&
        input.selectionEnd === input.value.length
      ) {
        const next = input.nextElementSibling;
        next.focus();
        next.setSelectionRange(1, 1);
        e.preventDefault();
      }
      break;
    case "Delete":
      //if we are at the end of input
      if (
        input.selectionStart === input.value.length &&
        input.selectionEnd === input.value.length
      ) {
        const next = input.nextElementSibling;
        // al chars expet the first one it going to remove
        next.value = next.value.substring(1, next.value.length);
        next.focus();
        next.setSelectionRange(0, 0);
        e.preventDefault();
      }
      break;
    case "Backspace":
      if (input.selectionStart === 0 && input.selectionEnd === 0) {
        const prev = input.previousElementSibling;
        prev.value = prev.value.substring(0, prev.value.length - 1);
        prev.focus();
        prev.setSelectionRange(prev.value.length, prev.value.length);
        e.preventDefault();
      }
      break;
    default:
      // prevent copy paste
      if (e.ctrlKey || e.altKey) return;
      if (key.length > 1) return;
      // matches numbers only (if not numbers)
      if (key.match(/^[^0-9]$/)) return e.preventDefault();

      e.preventDefault();
      onInputChange(input, key);
      break;
  }
});

document.addEventListener("paste", (e) => {
  const input = e.target;
  const data = e.clipboardData.getData("text");
  if (!isConnectedInput(input)) return;
  if (!data.match(/^[0-9]+$/)) return e.preventDefault();

  e.preventDefault(); // prevent normal paste operation
  onInputChange(input, data);
});

function onInputChange(input, newValue) {
  const start = input.selectionStart;
  const end = input.selectionEnd;

  updateInputValue(input, newValue, start, end);
  focusInput(input, newValue.length + start);

  // handle logo
  const firstFourDigits = input
    .closest("[data-connected-inputs]")
    .querySelector("input").value;
  if (firstFourDigits.startsWith("4")) {
    logo.src = "visa.svg";
  } else if (firstFourDigits.startsWith("5")) {
    logo.src = "mastercard.svg";
  }
}

//12345678
function updateInputValue(input, extraValue, start = 0, end = 0) {
  const newValue = `${input.value.substring(
    0,
    start // get not select at startin input
  )}${extraValue}${input.value.substring(end, 4)}`; // get the not select at the end;
  input.value = newValue.substring(0, 4);

  //added new information to next input
  if (newValue > 4) {
    const next = input.nextElementSibling;
    if (next == null) return;
    updateInputValue(next, newValue.substring(4)); //5678
  }
}

function focusInput(input, dataLength) {
  let addedChars = dataLength;
  let currentInput = input;

  // if we had more chars to add and current input has input after
  while (addedChars > 4 && currentInput.nextElementSibling != null) {
    console.log(addedChars);
    addedChars -= 4;

    currentInput = currentInput.nextElementSibling;
  }
  if (addedChars > 4) addedChars = 4;
  currentInput.focus();
  currentInput.selectionStart = addedChars;
  currentInput.selectionEnd = addedChars;
}

function isConnectedInput(input) {
  const parent = input.closest("[data-connected-inputs]");
  // means we inside a connected input
  return input.matches("input") && parent != null;
}
