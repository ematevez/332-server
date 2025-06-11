const StudentList = ({ students, onEdit, onDelete }) => (
  <div>
    <h2>Lista de estudiantes</h2>
    {students.length === 0 && <p>No hay estudiantes aún.</p>}
    <ul>
      {students.map((s) => (
        <li key={s._id}>
          <strong>{s.name}</strong> - {s.email}
          <button onClick={() => onEdit(s)}>Editar</button>
          <button onClick={() => onDelete(s._id)}>Eliminar</button>
        </li>
      ))}
    </ul>
  </div>
);

export default StudentList;
