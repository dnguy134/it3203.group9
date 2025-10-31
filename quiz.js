document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("quizForm");
  const resultsDiv = document.getElementById("results");
  const resetBtn = document.getElementById("resetBtn");
  const submitBtn = document.querySelector(".submit-btn");

  // === CORRECT ANSWERS ===
  const correctAnswers = {
    q1: "mosaic",                    // Fill-in-the-blank
    q2: "b",                         // Tim Berners-Lee
    q3: "b",                         // Internet Explorer
    q4: "b",                         // 2008
    q5: ["netscape", "ie"]           // First Browser War
  };

  // === FORM SUBMISSION ===
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let score = 0;
    const total = 6;
    let feedback = [];

    // Q1: Fill-in-the-blank
    const q1 = document.querySelector('input[name="q1"]').value.trim().toLowerCase();
    const q1Correct = q1 === correctAnswers.q1;
    if (q1Correct) score++;
    feedback.push(`
      <p><strong>Q1:</strong> <span class="${q1Correct ? 'correct' : 'incorrect'}">
        ${q1Correct ? 'Correct' : 'Incorrect'}
      </span> — You said: "<strong>${q1 || '(empty)'}</strong>" | Correct: <code>Mosaic</code></p>
    `);

    // Q2–Q4: Radio buttons
    ["q2", "q3", "q4"].forEach((q, i) => {
      const selected = document.querySelector(`input[name="${q}"]:checked`);
      const userAns = selected ? selected.value : null;
      const correct = correctAnswers[q];
      const isCorrect = userAns === correct;
      if (isCorrect) score++;

      const labels = {
        q2: { b: "Tim Berners-Lee" },
        q3: { b: "Internet Explorer" },
        q4: { b: "2008" }
      };
      const displayAns = userAns ? labels[q][userAns] : "(none)";
      const correctDisplay = labels[q][correct];

      feedback.push(`
        <p><strong>Q${i+2}:</strong> <span class="${isCorrect ? 'correct' : 'incorrect'}">
          ${isCorrect ? 'Correct' : 'Incorrect'}
        </span> — You chose: <strong>${displayAns}</strong> | Correct: <strong>${correctDisplay}</strong></p>
      `);
    });

    // Q5: Multi-select (2 points)
    const q5Selected = Array.from(document.querySelectorAll('input[name="q5"]:checked'))
                            .map(cb => cb.value);
    const q5Correct = arraysEqual(q5Selected.sort(), correctAnswers.q5.sort());
    if (q5Correct) score += 2;

    feedback.push(`
      <p><strong>Q5:</strong> <span class="${q5Correct ? 'correct' : 'incorrect'}">
        ${q5Correct ? 'Correct' : 'Incorrect'}
      </span> — You selected: <strong>${q5Selected.join(", ") || "(none)"}</strong> 
      | Correct: <strong>Netscape Navigator, Internet Explorer</strong></p>
    `);

    // === QUIZ RESULTS ===
    const passed = score >= 5;
    resultsDiv.className = `result ${passed ? 'pass' : 'fail'}`;
    resultsDiv.innerHTML = `
      <h2>${passed ? 'Congratulations! You Passed!' : 'Review and study some more!'}</h2>
      <p class="score">Total Score: ${score} / ${total}</p>
      ${feedback.join("")}
    `;
    resultsDiv.style.display = "block";
    submitBtn.style.display = "none";
    resetBtn.style.display = "inline-block";
  });

  // === RESET QUIZ ===
  resetBtn.addEventListener("click", () => {
    form.reset();
    resultsDiv.style.display = "none";
    submitBtn.style.display = "inline-block";
    resetBtn.style.display = "none";
  });

  // Helper: Compare arrays
  function arraysEqual(a, b) {
    return a.length === b.length && a.every((val, i) => val === b[i]);
  }
});
