import { useState, useContext } from "react";
import axios from "../../config/api/axios";
import UserContext from "../../Hooks/UserContext";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const InternalResultForm = () => {
  const { paperList } = useContext(UserContext);
  const [paper, setPaper] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [internal, setInternal] = useState([]);
  const [id, setId] = useState([]);
  const [error, setError] = useState("");

  const fetchInternal = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("/internal/" + paper);
      setId(response.data._id);
      setInternal(response.data.marks);
      setDisabled(true);
      setError("");
    } catch (err) {
      setError(err);
      if (err.response.status === 404) {
        const response = await axios.get("paper/" + paper);
        const students = response.data.students;
        students.forEach((student) => {
          Object.assign(student, {
            test: 0,
            seminar: 0,
            assignment: 0,
            attendance: 0,
            total: 0,
          });
        });
        setInternal(students);
        setDisabled(false);
      }
    }
  };

  const addInternalMark = async (e) => {
    e.preventDefault();
    const marks = { id, paper, marks: internal };
    try {
      const response = await axios.post("internal/" + paper, marks);
      toast.success(response.data.message);
      setDisabled(true);
      setError("");
      fetchInternal(e);
    } catch (err) {
      if (err.response.status === 409) {
        try {
          const response = await axios.patch("internal/" + paper, marks);
          toast.success(response.data.message);
          setDisabled(true);
          setError("");
        } catch (err) {
          setError(err);
        }
      } else setError(err);
    }
  };

  const deleteInternalMark = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete("internal/" + id);
      toast.success(response.data.message, {
        icon: ({ theme, type }) => <FaTrash />,
      });
      setInternal([]);
    } catch (err) {
      setError(err);
    }
  };

  const handleFormChange = (e) => {
    const index = parseInt(e.target.id);
    const value = e.target.value;
    const key = e.target.name;
    const newStudent = internal[index];
    newStudent[key] = value;
    const newInternal = internal.map((student, index) => {
      if (index === e.target.id) {
        return newStudent;
      } else return student;
    });
    setInternal(newInternal);
  };

  return (
    <main className="internal">
      <h2>Internal Mark</h2>
      <section className="form__head">
        <form className="internal__form">
          <select
            className="form__select"
            placeholder="select paper"
            name="paper"
            id="paper"
            value={paper}
            required
            onChange={(e) => setPaper(e.target.value)}
          >
            <option defaultValue hidden>
              Select Paper
            </option>
            {paperList.map((paper) => (
              <option key={paper._id} value={paper._id}>
                {paper.paper}
              </option>
            ))}
          </select>
          <button type="submit" onClick={(e) => fetchInternal(e)}>
            Fetch
          </button>
        </form>
      </section>
      <div>
        <p className="form__error">
          {error ? error?.response?.data?.message || error?.response?.data : ""}
        </p>
      </div>
      <section className="internal__body">
        <form className="internal__body__form">
          <table className="table">
            {internal.length ? (
              <thead>
                <tr>
                  <th>student</th>
                  <th>test</th>
                  <th>seminar</th>
                  <th>assignment</th>
                  <th>attendance</th>
                  <th>total</th>
                </tr>
              </thead>
            ) : (
              ""
            )}
            <tbody>
              {internal?.map((student, index) => (
                <tr
                  key={index}
                  className={
                    parseInt(student?.test) +
                      parseInt(student?.seminar) +
                      parseInt(student?.assignment) +
                      parseInt(student?.attendance) <
                    7
                      ? "bg-red"
                      : "bg-green"
                  }
                >
                  <td>{student.name}</td>
                  <td>
                    <input
                      type="number"
                      required
                      min="0"
                      max="3"
                      disabled={disabled}
                      id={index}
                      name="test"
                      value={student.test}
                      onChange={(e) => handleFormChange(e)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      required
                      min="0"
                      max="3"
                      disabled={disabled}
                      id={index}
                      name="seminar"
                      value={student.seminar}
                      onChange={(e) => handleFormChange(e)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      required
                      min="0"
                      max="3"
                      disabled={disabled}
                      id={index}
                      name="assignment"
                      value={student.assignment}
                      onChange={(e) => handleFormChange(e)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      required
                      min="0"
                      max="3"
                      disabled={disabled}
                      id={index}
                      name="attendance"
                      value={student.attendance}
                      onChange={(e) => handleFormChange(e)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      required
                      min="0"
                      max="3"
                      disabled
                      id={index}
                      name="total"
                      value={
                        parseInt(student?.test) +
                        parseInt(student?.seminar) +
                        parseInt(student?.assignment) +
                        parseInt(student?.attendance)
                      }
                      onChange={(e) => handleFormChange(e)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {internal.length && disabled ? (
            <div className="footer">
              <button type="submit" onClick={(e) => setDisabled(false)}>
                <FaEdit /> Edit
              </button>
              <button
                type="submit"
                className="delete_btn"
                onClick={(e) => deleteInternalMark(e)}
              >
                <FaTrash /> Delete
              </button>
            </div>
          ) : (
            ""
          )}
          {!disabled && (
            <button type="submit" onClick={(e) => addInternalMark(e)}>
              <FaPlus /> Save
            </button>
          )}
        </form>
      </section>
    </main>
  );
};

export default InternalResultForm;
