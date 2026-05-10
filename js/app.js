window.onload = function () {

    const input = document.getElementById("inputText");
    const output = document.getElementById("outputText");

    input.addEventListener("input", () => {

        let text = input.value.toLowerCase();

        // Add spaces around punctuation
        text = " " + text + " ";

        text = text.replace(/([,!?;:.])/g, " $1 ");

        // normalize ONLY spaces/tabs, keep newlines
        text = text.replace(/[ \t]+/g, " ");

        // process line by line
        let lines = text.split("\n");

        let finalLines = lines.map(line => {

            let trimmed = line.trim();

            if (!trimmed) return "";

            // FULL sentence match
            if (window.DB[trimmed]) {
                return window.DB[trimmed];
            }

            let words = trimmed.split(" ");

            let result = words.map(word => {

                // keep punctuation unchanged
                if (/^[,!?;:]+$/.test(word)) {
                    return word;
                }

                return transliterateWord(word);

            });

            let finalOutput = result.join(" ");

            // remove spaces before punctuation
            finalOutput = finalOutput.replace(/\s+([,!?;:.])/g, "$1");

            // normalize spaces again
            finalOutput = finalOutput.replace(/[ \t]+/g, " ").trim();

            return finalOutput;

        });

        output.value = finalLines.join("\n");
    });
};