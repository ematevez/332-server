import { useState, useEffect } from "react";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent
} from "./services/studentService";

import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";

function App() {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(null);

  const loadStudents = async () => {
    const res = await getStudents();
    setStudents(res.data);
  };

  const handleSave = async (data) => {
    if (selected) {
      await updateStudent(selected._id, data);
    } else {
      await createStudent(data);
    }
    loadStudents();
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este estudiante?")) {
      await deleteStudent(id);
      loadStudents();
    }
  };

  const handleEdit = (student) => {
    setSelected(student);
  };

  const clearSelection = () => setSelected(null);

  useEffect(() => {
    loadStudents();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>App de Estudiantes</h1>
      <StudentForm
        onSave={handleSave}
        selected={selected}
        clearSelection={clearSelection}
      />
      <hr />
      <StudentList
        students={students}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;
