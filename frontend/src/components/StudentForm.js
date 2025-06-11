import { useState, useEffect } from "react";

const StudentForm = ({ onSave, selected, clearSelection }) => {
  const [form, setForm] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (selected) {
      setForm({ name: selected.name, email: selected.email });
    }
  }, [selected]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setErrors([]);

    if (!form.name || !form.email) {
      setErrors(["Todos los campos son obligatorios"]);
      return;
    }

    onSave(form);
    setForm({ name: "", email: "" });
    clearSelection();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{selected ? "Editar" : "Agregar"} estudiante</h2>

      {errors.length > 0 && (
        <ul style={{ color: "red" }}>
          {errors.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      )}

      <input
        name="name"
        placeholder="Nombre"
        value={form.name}
        onChange={handleChange}
      />
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />

      <button type="submit">{selected ? "Actualizar" : "Agregar"}</button>
      {selected && (
        <button type="button" onClick={() => {
          clearSelection();
          setForm({ name: "", email: "" });
        }}>Cancelar</button>
      )}
    </form>
  );
};

export default StudentForm;
