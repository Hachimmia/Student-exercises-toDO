document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username === 'staff' && password === 'PasswOrd123') {
    localStorage.setItem('isLoggedIn', 'true'); // 🔐 Store login state
    showDashboard();
//    document.getElementById('login-page').style.display = 'none';
//    document.getElementById('dashboard').style.display = 'flex';
    loadPage('students');
  } else {
    
  }
});

function logout() {
  localStorage.removeItem('isLoggedIn'); // 🚪 Clear login state
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('login-page').style.display = 'flex';
  document.getElementById('login-form').reset();
}

//function loadPage(page) {
//  fetch(`${page}.json`)
//    .then(response => response.json())
//    .then(data => {
//      if (page === 'students') renderStudents(data);
//      if (page === 'courses') renderCourses(data);
//    });
//}
function loadPage(page) {
  if (page === 'students') {
    const stored = localStorage.getItem('students');
    if (stored) {
      renderStudents(JSON.parse(stored));
    } else {
      fetch(`${page}.json`)
        .then(response => response.json())
        .then(data => {
          localStorage.setItem('students', JSON.stringify(data));
          renderStudents(data);
        });
    }
  }

  if (page === 'courses') {
    fetch(`${page}.json`)
      .then(response => response.json())
      .then(data => renderCourses(data));
  }
}

function renderStudents(students) {
  const content = document.getElementById('content');
  content.innerHTML = '<h2>Student List</h2>' + `
    <div class="full-width-form">
      <input id="name" placeholder="Name" />
      <input id="age" type="number" placeholder="Age" />
      <input id="email" placeholder="Email" />
      <button onclick="addStudent()">Add Student</button>
    </div>
    <table>
      <thead><tr><th>Name</th><th>Age</th><th>Email</th><th>Actions</th></tr></thead>
      <tbody id="student-table">
      ${students.map((s, i) => `
        <tr>
          <td>${s.name}</td><td>${s.age}</td><td>${s.email}</td>
          <td> 
           <div class="action-buttons">
              <button onclick="editStudent(${i})">Update</button> <!--EXERCISE FOR STUDENTS UPDATE BUTTON-->
              <button onclick="deleteStudent(${i})">Delete</button>
            </div>
            </td>

        </tr>`).join('')}
      </tbody>
    </table>`;
  window.students = students;
}
//<!--EXERCISE FOR STUDENTS UPDATE BUTTON-->

let editingIndex = null;

function editStudent(index) {
  const student = students[index];
  document.getElementById('name').value = student.name;
  document.getElementById('age').value = student.age;
  document.getElementById('email').value = student.email;
  editingIndex = index;
  const submitBtn = document.getElementById('submit-btn');
  submitBtn.textContent = 'Save Changes';
  submitBtn.setAttribute('onclick', 'updateStudent()');
}
function updateStudent() {
  const name = document.getElementById('name').value;
  const age = parseInt(document.getElementById('age').value);
  const email = document.getElementById('email').value;
  if (!name || !email || isNaN(age)) return alert('All fields required');
  students[editingIndex] = { name, age, email };
  localStorage.setItem('students', JSON.stringify(students));
  renderStudents(students);
  clearForm();
  editingIndex = null;
  const submitBtn = document.getElementById('submit-btn');
  submitBtn.textContent = 'Update Student';
  submitBtn.setAttribute('onclick', 'updateStudent()');
}

//FINE UPDATE BUTTON
function addStudent() {
  const name = document.getElementById('name').value;
  const age = parseInt(document.getElementById('age').value);
  const email = document.getElementById('email').value;
  if (!name || !email || isNaN(age)) return alert('All fields required');
  students.push({ name, age, email });
  localStorage.setItem('students', JSON.stringify(students)); // Save updated list
  renderStudents(students);
  clearForm();
}

function deleteStudent(index) {
  students.splice(index, 1);
  localStorage.setItem('students', JSON.stringify(students)); // Save updated list
  renderStudents(students);
}

function renderCourses(courses) {
  const content = document.getElementById('content');
  content.innerHTML = '<h2>Courses</h2><table><thead><tr><th>Title</th><th>Credits</th><th>Instructor</th><th>Semester</th></tr></thead><tbody>' +
    courses.map(c => `<tr><td>${c.title}</td><td>${c.credits}</td><td>${c.instructor}</td><td>${c.semester}</td></tr>`).join('') +
    '</tbody></table>';
}

window.onload = function () {
  if (localStorage.getItem('isLoggedIn') === 'true') {
    showDashboard();
    loadPage('students');
  }
};

function showDashboard() {
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('dashboard').style.display = 'flex';
}

function clearForm() {
  document.getElementById('name').value = '';
  document.getElementById('age').value = '';
  document.getElementById('email').value = '';
}