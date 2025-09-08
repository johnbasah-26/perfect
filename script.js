        // Mobile menu toggle
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
        
        let currentSlide = 0;
        const heroSlides = document.querySelectorAll('.hero-slide');
        let timer;

        function showSlide(n) {
            heroSlides.forEach((s) => {
                s.classList.remove("active");
            });
            heroSlides[n].classList.add("active");
            currentSlide = n;
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % heroSlides.length;
            showSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + heroSlides.length) % heroSlides.length
            showSlide(currentSlide);
        }

        // Change slide every 5 seconds
        function startAutoPlay() {timer = setInterval(nextSlide, 5000);}
        function stopAutoPlay() {clearInterval(timer);}

        showSlide(0);
        startAutoPlay();

        
        // Sample data storage (in a real app, this would be server-side)
        let results = JSON.parse(localStorage.getItem('pureKarisResults')) || [];
        const adminUsername = "perfect";
        const adminPassword = "p26";

        // DOM Elements
        const adminForm = document.getElementById('admin-form');
        const resultForm = document.getElementById('result-form');
        const adminPanel = document.getElementById('admin-panel');
        const resultDisplay = document.getElementById('result-display');
        const addResultForm = document.getElementById('add-result-form');
        const viewResultsSection = document.getElementById('view-results');
        const addResultBtn = document.getElementById('add-result-btn');
        const viewResultsBtn = document.getElementById('view-results-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const resultEntryForm = document.getElementById('result-entry-form');
        const subjectScores = document.getElementById('subject-scores');
        const addSubjectBtn = document.getElementById('add-subject-btn');
        const resultsList = document.getElementById('results-list');
        const searchResults = document.getElementById('search-results');
        const printResultBtn = document.getElementById('print-result');
        const backToPortalBtn = document.getElementById('back-to-portal');

        // Admin Login
        adminForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('admin-username').value;
            const password = document.getElementById('admin-password').value;
            
            if (username === adminUsername && password === adminPassword) {
                // Successful login
                document.getElementById('admin-login').style.display = 'none';
                document.getElementById('student-login').style.display = 'none';
                adminPanel.style.display = 'block';
                
                // Clear form
                adminForm.reset();
            } else {
                alert('Invalid username or password');
            }
        });

        // Check Results
        resultForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const studentCode = document.getElementById('student-code').value;
            
            // Find result by student code
            const result = results.find(r => r.studentId === studentCode);
            
            if (result) {
                displayResult(result);
            } else {
                alert('No result found for this code. Please check and try again.');
            }
            
            // Clear form
            resultForm.reset();
        });

        // Admin Panel Navigation
        addResultBtn.addEventListener('click', function() {
            addResultForm.style.display = 'block';
            viewResultsSection.style.display = 'none';
        });

        viewResultsBtn.addEventListener('click', function() {
            addResultForm.style.display = 'none';
            viewResultsSection.style.display = 'block';
            displayAllResults();
        });

        logoutBtn.addEventListener('click', function() {
            adminPanel.style.display = 'none';
            document.getElementById('admin-login').style.display = 'block';
            document.getElementById('student-login').style.display = 'block';
        });

        // Add Subject Row
        addSubjectBtn.addEventListener('click', function() {
            addSubjectRow();
        });

        // Save Result
        resultEntryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const studentName = document.getElementById('student-name').value;
            const studentClass = document.getElementById('student-class').value;
            const studentId = document.getElementById('student-id').value;
            const term = document.getElementById('term').value;
            const session = document.getElementById('session').value;
            const teacherRemarks = document.getElementById('teacher-remarks').value;
            const headRemarks = document.getElementById('head-remarks').value;
            
            // Get subject scores
            const subjects = [];
            const subjectRows = subjectScores.querySelectorAll('.subject-row');
            
            subjectRows.forEach(row => {
                const subjectName = row.querySelector('.subject-name').value;
                const classScore = parseInt(row.querySelector('.class-score').value) || 0;
                const examScore = parseInt(row.querySelector('.exam-score').value) || 0;
                const totalScore = Math.round(classScore * 0.4 + examScore * 0.6);
                
                let grade;
                if (totalScore >= 80) grade = 'A';
                else if (totalScore >= 70) grade = 'B';
                else if (totalScore >= 60) grade = 'C';
                else if (totalScore >= 50) grade = 'D';
                else if (totalScore >= 40) grade = 'E';
                else grade = 'F';
                
                subjects.push({
                    name: subjectName,
                    classScore: classScore,
                    examScore: examScore,
                    totalScore: totalScore,
                    grade: grade
                });
            });
            
            // Create result object
            const result = {
                studentName,
                studentClass,
                studentId,
                term,
                session,
                subjects,
                teacherRemarks,
                headRemarks,
                date: new Date().toISOString()
            };
            
            // Add to results array
            results.push(result);
            
            // Save to localStorage
            localStorage.setItem('pureKarisResults', JSON.stringify(results));
            
            // Clear form
            resultEntryForm.reset();
            subjectScores.innerHTML = '';
            
            // Show success message
            alert('Result saved successfully!');
            
            // Display the new result
            displayAllResults();
        });

        // Search Results
        searchResults.addEventListener('input', function() {
            displayAllResults(this.value);
        });

        // Print Result
        printResultBtn.addEventListener('click', function() {
            window.print();
        });

        // Back to Portal
        backToPortalBtn.addEventListener('click', function() {
            resultDisplay.style.display = 'none';
            document.getElementById('admin-login').style.display = 'block';
            document.getElementById('student-login').style.display = 'block';
        });

        // Helper Functions
        function addSubjectRow(subject = '', classScore = '', examScore = '') {
            const row = document.createElement('div');
            row.className = 'subject-row';
            row.innerHTML = `
                <input type="text" class="subject-name" placeholder="Subject" value="${subject}" required>
                <input type="number" class="class-score" placeholder="Class (40%)" min="0" max="100" value="${classScore}" required>
                <input type="number" class="exam-score" placeholder="Exams (60%)" min="0" max="100" value="${examScore}" required>
                <span class="remove-subject">&times;</span>
            `;
            subjectScores.appendChild(row);
            
            // Add remove event
            row.querySelector('.remove-subject').addEventListener('click', function() {
                row.remove();
            });
        }

        function displayResult(result) {
            // Hide other sections
            document.getElementById('admin-login').style.display = 'none';
            document.getElementById('student-login').style.display = 'none';
            adminPanel.style.display = 'none';
            
            // Show result display
            resultDisplay.style.display = 'block';
            
            // Set student info
            document.getElementById('display-name').textContent = result.studentName;
            document.getElementById('display-class').textContent = result.studentClass;
            document.getElementById('display-term').textContent = result.term;
            document.getElementById('display-session').textContent = result.session;
            
            // Set subjects table
            const tbody = document.querySelector('#result-table tbody');
            tbody.innerHTML = '';
            
            result.subjects.forEach(subject => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${subject.name}</td>
                    <td>${subject.classScore}</td>
                    <td>${subject.examScore}</td>
                    <td>${subject.totalScore}</td>
                    <td>${subject.grade}</td>
                `;
                tbody.appendChild(row);
            });
            
            // Set remarks
            document.getElementById('teacher-remarks-display').textContent = result.teacherRemarks || 'N/A';
            document.getElementById('head-remarks-display').textContent = result.headRemarks || 'N/A';
        }

        function displayAllResults(searchTerm = '') {
            resultsList.innerHTML = '';
            
            const filteredResults = searchTerm 
                ? results.filter(r => 
                    r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    r.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
                : results;
            
            if (filteredResults.length === 0) {
                resultsList.innerHTML = '<p>No results found</p>';
                return;
            }
            
            filteredResults.forEach((result, index) => {
                const item = document.createElement('div');
                item.className = 'result-item';
                item.innerHTML = `
                    <div>
                        <strong>${result.studentName}</strong> - ${result.studentClass}<br>
                        <small>${result.term} Term, ${result.session}</small>
                    </div>
                    <div class="actions">
                        <button class="btn small view-btn" data-index="${index}">View</button>
                        <button class="btn small delete-btn" data-index="${index}">Delete</button>
                    </div>
                `;
                resultsList.appendChild(item);
            });
            
            // Add event listeners to buttons
            document.querySelectorAll('.view-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    displayResult(results[index]);
                });
            });
            
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    if (confirm('Are you sure you want to delete this result?')) {
                        results.splice(index, 1);
                        localStorage.setItem('pureKarisResults', JSON.stringify(results));
                        displayAllResults(searchResults.value);
                    }
                });
            });
        }

        // Initialize with one subject row
        addSubjectRow();

      // form.js - modal controls + PDF generation (official-style)
// NOTE: requires jsPDF CDN to be loaded before this file.

document.addEventListener('DOMContentLoaded', () => {
  const modalRoot = document.getElementById('admissionModal');
  const openBtn = document.getElementById('openFormBtn');
  const closeBtn = document.getElementById('closeModal');
  const closeBtnBottom = document.getElementById('closeModalBottom');
  const backdrop = document.getElementById('admissionBackdrop');
  const downloadBtn = document.getElementById('downloadPdfBtn');
  const form = document.getElementById('admissionForm');

  // Safety checks
  if (!modalRoot || !openBtn || !form || !downloadBtn) {
    console.error('Admission modal: required elements not found. Check your HTML IDs.');
    return;
  }

  function showModal() {
    modalRoot.classList.add('show');
    modalRoot.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function hideModal() {
    modalRoot.classList.remove('show');
    modalRoot.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showModal();
  });
  closeBtn?.addEventListener('click', hideModal);
  closeBtnBottom?.addEventListener('click', hideModal);
  backdrop?.addEventListener('click', hideModal);
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideModal(); });

  // Helper to collect checkbox values
  function collectChecked(name) {
    const nodes = Array.from(form.querySelectorAll(`[name="${name}"]`));
    return nodes.filter(n => n.checked).map(n => n.value);
  }

  // Optional: convert image file to dataURL (for passport) and return Promise
  function readImageDataURL(inputFile) {
    return new Promise((resolve) => {
      if (!inputFile) return resolve(null);
      const file = inputFile.files && inputFile.files[0];
      if (!file) return resolve(null);
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result);
      fr.onerror = () => resolve(null);
      fr.readAsDataURL(file);
    });
  }

  // Main PDF generation
  downloadBtn.addEventListener('click', async () => {
    // Collect fields
    const data = {
      otherNames: form.querySelector('#otherNames')?.value || '',
      address: form.querySelector('#address')?.value || '',
      dob: form.querySelector('#dob')?.value || '',
      stateOrigin: form.querySelector('#stateOrigin')?.value || '',
      religion: form.querySelector('#religion')?.value || '',
      presentSchool: form.querySelector('#presentSchool')?.value || '',
      entryClass: form.querySelector('#entryClass')?.value || '',
      parentName: form.querySelector('#parentName')?.value || '',
      parentOccupation: form.querySelector('#parentOccupation')?.value || '',
      parentAddress: form.querySelector('#parentAddress')?.value || '',
      parentTelephone: form.querySelector('#parentTelephone')?.value || '',
      parentEmail: form.querySelector('#parentEmail')?.value || '',
      mealOption: form.querySelector('#mealOption')?.checked ? 'Yes' : 'No',
      busOption: form.querySelector('#busOption')?.checked ? 'Yes' : 'No',
      extraLessons: form.querySelector('#extraLessons')?.checked ? 'Yes' : 'No',
      activities: collectChecked('activities'),
      fillMedicalNow: form.querySelector('#fillMedicalNow')?.value || '',
      emergencyNumber: form.querySelector('#emergencyNumber')?.value || '',
      doctorName: form.querySelector('#doctorName')?.value || '',
      clinicName: form.querySelector('#clinicName')?.value || '',
      clinicAddress: form.querySelector('#clinicAddress')?.value || '',
      clinicPhone: form.querySelector('#clinicPhone')?.value || '',
      vaccines: {
        bcg: form.querySelector('#v_bcg')?.value || '',
        hepB: form.querySelector('#v_hepB')?.value || '',
        measles: form.querySelector('#v_measles')?.value || '',
        opv: form.querySelector('#v_opv')?.value || '',
        dpt1: form.querySelector('#v_dpt1')?.value || '',
        dpt2: form.querySelector('#v_dpt2')?.value || '',
        dpt3: form.querySelector('#v_dpt3')?.value || ''
      },
      tetanus: form.querySelector('#tetanus')?.value || '',
      tetanusDate: form.querySelector('#tetanusDate')?.value || '',
      hasAllergies: form.querySelector('#hasAllergies')?.value || '',
      allergyDetails: form.querySelector('#allergyDetails')?.value || '',
      medicalConditions: form.querySelector('#medicalConditions')?.value || '',
      history: collectChecked('history'),
      authoriseClinic: form.querySelector('#authoriseClinic')?.value || '',
      referralSource: form.querySelector('#referralSource')?.value || '',
      filledBy: form.querySelector('#filledBy')?.value || '',
      filledDate: form.querySelector('#filledDate')?.value || '',
    };

    // read passport image if provided
    const passportImg = await readImageDataURL(form.querySelector('#passportPhoto'));

    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
      const margin = 15;
      let y = 20;

      // Header
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('PURE KARIS SCHOOL', 105, y, { align: 'center' });
      y += 6;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text('Official Admission Form', 105, y, { align: 'center' });
      y += 8;
      doc.setLineWidth(0.5);
      doc.line(margin, y, 210 - margin, y);
      y += 6;

      // Student details (two-column layout)
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('STUDENT DETAILS', margin, y);
      y += 6;
      doc.setFont('helvetica', 'normal');

      const leftColX = margin;
      const rightColX = 110;

      // helper to add label + value at positions
      function addKV(label, value, x, yy) {
        doc.setFont('helvetica', 'bold'); doc.text(label, x, yy);
        doc.setFont('helvetica', 'normal');
        const split = doc.splitTextToSize(value || '-', 90);
        doc.text(split, x, yy + 4);
        return yy + 4 * (split.length) + 4;
      }

      // left col
      y = addKV('Other Names:', data.otherNames, leftColX, y);
      y = addKV('Address:', data.address, leftColX, y);
      y = addKV('Date of Birth:', data.dob, leftColX, y);

      // right col start at original y
      let ry = y - (4 + (doc.splitTextToSize(data.dob || '-', 90).length * 4)); // align roughly
      ry = addKV('State of Origin:', data.stateOrigin, rightColX, ry);
      ry = addKV('Religion:', data.religion, rightColX, ry);
      ry = addKV('Present School:', data.presentSchool, rightColX, ry);
      ry = addKV('Entry Class:', data.entryClass, rightColX, ry);

      // advance y to max of left/right columns
      y = Math.max(y, ry) + 4;

      // Parent details
      doc.setFont('helvetica', 'bold'); doc.text('PARENT / GUARDIAN', margin, y);
      y += 6; doc.setFont('helvetica', 'normal');

      y = addKV('Name:', data.parentName, leftColX, y);
      y = addKV('Occupation:', data.parentOccupation, leftColX, y);
      y = addKV('Address:', data.parentAddress, rightColX, y);
      y = addKV('Telephone:', data.parentTelephone, rightColX, y);
      y = addKV('Email:', data.parentEmail, rightColX, y);

      y += 4;
      // Choices & Activities
      doc.setFont('helvetica', 'bold'); doc.text('CHOICES & ACTIVITIES', margin, y);
      y += 6; doc.setFont('helvetica', 'normal');

      const choices = `Meal: ${data.mealOption}  |  Bus: ${data.busOption}  |  Extra Lessons: ${data.extraLessons}`;
      const acts = data.activities.length ? data.activities.join(', ') : '-';
      doc.text(choices, margin, y);
      y += 6;
      doc.text('Extracurricular Activities: ' + acts, margin, y);
      y += 8;

      // Medical section header
      doc.setFont('helvetica', 'bold'); doc.text('MEDICAL INFORMATION', margin, y);
      y += 6; doc.setFont('helvetica', 'normal');

      y = addKV('Fill Medical Now:', data.fillMedicalNow, leftColX, y);
      y = addKV('Emergency No.:', data.emergencyNumber, leftColX, y);
      y = addKV('Doctor:', data.doctorName, rightColX, y);
      y = addKV('Clinic:', data.clinicName, rightColX, y);
      y = addKV('Clinic Address:', data.clinicAddress, rightColX, y);
      y = addKV('Clinic Phone:', data.clinicPhone, rightColX, y);

      y += 6;
      doc.setFont('helvetica', 'bold'); doc.text('Vaccinations (dates):', margin, y);
      y += 6; doc.setFont('helvetica', 'normal');

      const vacs = `BCG: ${data.vaccines.bcg || '-'}  | HepB: ${data.vaccines.hepB || '-'}  | Measles: ${data.vaccines.measles || '-'}  | OPV: ${data.vaccines.opv || '-'}  | DPT1: ${data.vaccines.dpt1 || '-'}  | DPT2: ${data.vaccines.dpt2 || '-'}  | DPT3: ${data.vaccines.dpt3 || '-'}`;
      const vacLines = doc.splitTextToSize(vacs, 180 - margin * 2);
      doc.text(vacLines, margin, y);
      y += vacLines.length * 5 + 4;

      y = addKV('Tetanus:', data.tetanus + (data.tetanusDate ? ` (Date: ${data.tetanusDate})` : ''), leftColX, y);
      y = addKV('Allergies:', data.hasAllergies, rightColX, y);
      y = addKV('Allergy details:', data.allergyDetails, leftColX, y);
      y = addKV('Known conditions:', data.medicalConditions, rightColX, y);
      y += 6;

      doc.setFont('helvetica', 'bold'); doc.text('History:', margin, y);
      y += 6; doc.setFont('helvetica', 'normal');
      doc.text((data.history.length ? data.history.join(', ') : '-'), margin, y);
      y += 8;

      y = addKV('Authorise referral clinic?:', data.authoriseClinic, leftColX, y);
      y += 6;

      // Other / footer
      doc.setFont('helvetica', 'bold'); doc.text('OTHER', margin, y);
      y += 6; doc.setFont('helvetica', 'normal');
      y = addKV('How did you hear about us?', data.referralSource, leftColX, y);
      y = addKV('Form filled by:', data.filledBy, rightColX, y);
      y = addKV('Date:', data.filledDate, rightColX, y);

      y += 10;

      // If passport image exists, try to add to top-right of first page
      if (passportImg) {
        try {
          // place at top-right area
          doc.addImage(passportImg, 'JPEG', 160, 30, 35, 45);
        } catch (err) {
          console.warn('Could not add passport image to PDF (size/type issue).', err);
        }
      }

      // final note
      doc.setFontSize(9);
      doc.setTextColor(80);
      doc.text('NOTE: Please keep a printed copy of this application for your records.', margin, 285);

      // save
      doc.save(`admission_${(data.parentName || 'application').replace(/\s+/g,'_')}.pdf`);
      hideModal();
    } catch (err) {
      console.error('PDF generation error', err);
      alert('Could not generate PDF — check console for details.');
    }
  });
});
