document.addEventListener("DOMContentLoaded", () => {
  const revealSelector =
    ".back, .topic-navigation a, .topic-card, .lens-card, .formula-card, .qa-card, .gallery-grid img, .section-header, .concept-layout, .formula-box, .card > h1, .card > h2, .card > p, .card > .diagram, .card > .equation, .card > .formula, .card > .note, .card, .exercise-item, .video-card";
  const revealTargets = [...document.querySelectorAll(revealSelector)].filter(
    (element) => !element.querySelector(revealSelector)
  );

  if (revealTargets.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealTargets.forEach((element) => {
      element.classList.add("reveal");
    });

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.14 }
      );

      revealTargets.forEach((element) => observer.observe(element));
    } else {
      revealTargets.forEach((element) => element.classList.add("is-visible"));
    }
  }

  const questionEl = document.getElementById("qa-question");
  const answerEl = document.getElementById("qa-answer");
  const optionsEl = document.getElementById("qa-options");
  const counterEl = document.getElementById("qa-counter");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  if (questionEl && answerEl && optionsEl && counterEl && prevBtn && nextBtn) {
    const questions = [
      { q: "What is the bending of light when it enters a new medium called?", options: ["Reflection", "Refraction", "Diffraction", "Dispersion"], correct: 1 },
      { q: "What changes when light enters a different medium?", options: ["Its speed", "Its frequency", "Its color", "Its source"], correct: 0 },
      { q: "What is the symbol for refractive index?", options: ["f", "v", "n", "P"], correct: 2 },
      { q: "Which formula gives the refractive index in terms of the speed of light?", options: ["n = v/c", "n = c/v", "n = c × v", "n = c − v"], correct: 1 },
      { q: "Which equation expresses Snell's law?", options: ["n₁ sin i = n₂ sin r", "n₁ cos i = n₂ cos r", "n₁ + sin i = n₂ + sin r", "n₁/i = n₂/r"], correct: 0 },
      { q: "What separates two media in refraction?", options: ["A focal point", "A principal axis", "A boundary or surface", "A light source"], correct: 2 },
      { q: "Which is the lens equation used in this chapter?", options: ["1/f = 1/v + 1/u", "1/f = 1/v − 1/u", "f = u + v", "P = u/v"], correct: 0},
      { q: "What signs can distances have under the lens sign convention?", options: ["Only positive", "Only negative", "Positive or negative", "Neither positive nor negative"], correct: 2 },
      { q: "Which image can be projected onto a screen?", options: ["A real image", "A virtual image", "An image at infinity only", "No image"], correct: 0 },
      { q: "Which kind of image cannot be projected onto a screen?", options: ["Real", "Inverted", "Magnified", "Virtual"], correct: 3 },
      { q: "What happens to parallel rays passing through a convex lens?", options: ["They are absorbed", "They converge", "They stop", "They become parallel in every case"], correct: 1 },
      { q: "Why is an image formed by a concave lens usually virtual?", options: ["The rays actually meet behind the lens", "The rays are absorbed by the lens", "The diverging rays appear to come from a point", "The lens does not refract light"], correct: 2 },
      { q: "What does magnification compare?", options: ["Image size with object size", "Focal length with lens power", "Refractive index with speed", "Lens thickness with radius"], correct: 0 },
      { q: "What is the unit of lens power?", options: ["Metre", "Watt", "Dioptre", "Newton"], correct: 2 },
      { q: "Why does a concave lens have negative power?", options: ["It has a negative focal length", "It has no focal point", "It is thicker in the middle", "It always forms a real image"], correct: 0 }
    ];

    let currentIndex = 0;
    let selectedAnswers = Array(questions.length).fill(null);
    let quizComplete = false;

    function renderQuestion() {
      const item = questions[currentIndex];
      const selectedAnswer = selectedAnswers[currentIndex];
      questionEl.textContent = `${currentIndex + 1}. ${item.q}`;
      optionsEl.hidden = false;
      optionsEl.replaceChildren();
      item.options.forEach((option, index) => {
        const optionButton = document.createElement("button");
        optionButton.type = "button";
        optionButton.className = "qa-option";
        optionButton.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
        optionButton.setAttribute("aria-pressed", String(selectedAnswer === index));

        if (selectedAnswer !== null) {
          optionButton.disabled = true;
          if (index === item.correct) optionButton.classList.add("is-correct");
          if (index === selectedAnswer && selectedAnswer !== item.correct) {
            optionButton.classList.add("is-incorrect");
          }
        } else {
          optionButton.addEventListener("click", () => {
            selectedAnswers[currentIndex] = index;
            renderQuestion();
          });
        }

        optionsEl.append(optionButton);
      });

      answerEl.classList.toggle("hidden", selectedAnswer === null);
      if (selectedAnswer !== null) {
        answerEl.textContent = selectedAnswer === item.correct
          ? "Correct!"
          : `Not quite. The correct answer is ${String.fromCharCode(65 + item.correct)}. ${item.options[item.correct]}`;
      }
      counterEl.textContent = `Question ${currentIndex + 1}/${questions.length}`;
      prevBtn.disabled = currentIndex === 0;
      nextBtn.textContent = currentIndex === questions.length - 1 ? "Finish" : "Next";
      nextBtn.disabled = selectedAnswer === null;
    }

    prevBtn.addEventListener("click", () => {
      if (!quizComplete && currentIndex > 0) {
        currentIndex -= 1;
        renderQuestion();
      }
    });

    nextBtn.addEventListener("click", () => {
      if (quizComplete) {
        currentIndex = 0;
        selectedAnswers = Array(questions.length).fill(null);
        quizComplete = false;
        prevBtn.hidden = false;
        renderQuestion();
        return;
      }

      if (currentIndex < questions.length - 1) {
        currentIndex += 1;
        renderQuestion();
        return;
      }

      const score = selectedAnswers.reduce(
        (total, answer, index) => total + Number(answer === questions[index].correct),
        0
      );
      quizComplete = true;
      optionsEl.hidden = true;
      answerEl.textContent = `Quiz complete! Your score: ${score}/${questions.length}.`;
      questionEl.textContent = "Thanks for completing the quiz.";
      counterEl.textContent = "Results";
      prevBtn.hidden = true;
      answerEl.classList.remove("hidden");
      nextBtn.textContent = "Restart quiz";
      nextBtn.disabled = false;
    });

    renderQuestion();
  }
});
