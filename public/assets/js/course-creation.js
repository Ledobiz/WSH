const steps = document.querySelectorAll(".step");
const indicators = document.querySelectorAll(".step-indicator div");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentStep = 0;

function showStep(index) {
    steps.forEach((step, i) => {
        step.classList.toggle("active", i === index);
        indicators[i].classList.toggle("active", i <= index);
    });

    prevBtn.style.display = index === 0 ? "none" : "inline-block";
    nextBtn.textContent = index === steps.length - 1 ? "Submit" : "Next";
}

nextBtn.addEventListener("click", () => {
    if (currentStep < steps.length - 1) {
        currentStep++;
        showStep(currentStep);
    } else {
        // Redirect to thank you page
        window.location.href = "thank-you.html";
    }
});

prevBtn.addEventListener("click", () => {
    if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
    }
});

// Initialize
showStep(currentStep);

const curriculumContainer = document.getElementById('curriculumContainer');
const addSectionBtn = document.getElementById('addSection');

let sectionCount = 1;

addSectionBtn.addEventListener('click', () => {
    sectionCount++;
    const section = document.createElement('div');
    section.className = 'section border p-3 rounded mb-4';
    section.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="mb-0 text-dark">Lesson ${sectionCount}</h6>
            <button type="button" class="btn btn-sm btn-red remove-section rounded-2">Remove Section</button>
        </div>
        <div class="mb-3">
            <label class="form-label">Lesson Title</label>
            <input type="text" class="form-control" placeholder="e.g., Advanced Concepts">
        </div>
        <div class="lessons">
            <div class="lesson mb-3">
                <label class="form-label">Lecture Title</label>
                <input type="text" class="form-control mb-2" placeholder="e.g., Lecture Name">
                <textarea class="form-control" rows="2" placeholder="Lecture description..."></textarea>
            </div>
        </div>
        <button type="button" class="btn btn-sm btn-light-main add-lesson rounded-2">+ Add Lecture</button>
    `;
    curriculumContainer.appendChild(section);
});

// Delegate events for dynamic elements
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('add-lesson')) {
        const lessonsDiv = e.target.closest('.section').querySelector('.lessons');
        const lesson = document.createElement('div');
        lesson.className = 'lesson mb-3';
        lesson.innerHTML = `
            <label class="form-label">Lecture Title</label>
            <input type="text" class="form-control mb-2" placeholder="e.g., Lecture Name">
            <textarea class="form-control" rows="2" placeholder="Lecture description..."></textarea>
        `;
        lessonsDiv.appendChild(lesson);
    }

    if (e.target.classList.contains('remove-section')) {
        e.target.closest('.section').remove();
    }
});

const thumbnailInput = document.getElementById('thumbnailInput');
const thumbnailPreview = document.getElementById('thumbnailPreview');

thumbnailInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        thumbnailPreview.src = URL.createObjectURL(file);
        thumbnailPreview.style.display = 'block';
    } else {
        thumbnailPreview.style.display = 'none';
    }
});