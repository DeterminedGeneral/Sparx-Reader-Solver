console.log("The script is currently working!");
let lastExtract = "";
let lastQuestion = "";
let startingValue = "Q0.";

function requestGeneration(prompt, extract) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { action: "generate", prompt: prompt, extract: extract },
      (response) => {
        resolve(response.result);
      }
    );
  });
}

function copyTextParagraph(startAt, endAt) {
    // Get all text content from the body of the webpage
    const allText = document.body.innerText;

    // Find the part of the text starting from the first occurrence of "Q"
    const startIndex = allText.indexOf(startAt);
    if (endAt) {
      const afterStartIndex = startIndex + startAt.length;

      const endIndex = allText.indexOf(endAt, afterStartIndex);

      return allText.substring(afterStartIndex, endIndex).trim();
    }
    return allText.substring(startIndex).trim();
};

const observer = new MutationObserver((mutations) => {
    // Check if specific element exists or condition met
    const extractRead = document.querySelector('[class^="read-content"]');
    const questionRead = document.querySelector('[class="PanelPaperbackQuestionContainer"]'); // class="PanelPaperbackQuestionContainer"

    if (extractRead) {
        const copiedText = copyTextParagraph('Start reading here', 'Stop reading here');
        if (lastExtract !== copiedText) {
            lastExtract = copiedText;
            console.log(copiedText);
        }
    } 
    if (questionRead) {
        let copiedText = copyTextParagraph('Q');

        // Match all question starts
        const matches = [...copiedText.matchAll(/Q\d+\./g)];

        let updatedText = copiedText;

        if (matches.length > 1) {
            // If more than one question, remove the first one
            updatedText = copiedText.replace(/Q\d+\.[\s\S]*?(?=Q\d+\.)/, '');
        }

        copiedText = updatedText.trim();
        
        if ( (copiedText !== lastQuestion) && !(copiedText.startsWith(startingValue))) {
            startingValue = copiedText.slice(0, 3);
            lastQuestion = copiedText;
            console.log(copiedText);

            if (!lastExtract) {
              console.log("No extract to copy!");
              return;
            }

            requestGeneration(copiedText, lastExtract).then((result) => {
              console.log("Generated text:", result);
              alert(result);
            });
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });