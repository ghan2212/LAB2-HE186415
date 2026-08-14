import logo from './logo.svg';
import './App.css';
import { initialAttendances } from './db';
import useLocalStorage from './hook/useLocalStorage';
import { useState, useReducer, useEffect } from 'react';

const attendanceReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_STATUS':
      return state.map(item =>
        item.id === action.payload
          ? { ...item, status: item.status === 'PRESENT' ? 'ABSENT' : 'PRESENT' }
          : item
      );
    case 'DELETE_RECORD':
      return state.filter(item => item.id !== action.payload);
    default:
      return state;
  }
};

function App() {
  const [darkMode, setDarkMode] = useLocalStorage("darkMode", false);
  const [searchName, setSearchName] = useState('all');
  const [selectStatus, setSelectStatus] = useState('all');

  const [attendances, dispatch] = useReducer(attendanceReducer, [], () => {
    const localData = localStorage.getItem('attendances');
    return localData ? JSON.parse(localData) : initialAttendances;
  });

  useEffect(() => {
    localStorage.setItem('attendances', JSON.stringify(attendances));
  }, [attendances]);

  const getStatusArray = [...new Set(attendances.map((s) => s.status))];

  const filter = attendances.filter((c) => {
    const matchName = !searchName || searchName === "all" || c?.name.toLowerCase().includes(searchName.toLowerCase());
    const matchStatus = selectStatus === "all" || c?.status === selectStatus;
    return matchName && matchStatus;
  });

  const totalRecords = filter.length;
  const presentCount = filter.filter((i) => i.status === "PRESENT").length;
  const absentCount = filter.filter((i) => i.status === "ABSENT").length;
  const attendanceRate = totalRecords > 0 ? ((presentCount / totalRecords) * 100).toFixed(2) : 0;

  const handleResetFilters = () => {
    setSearchName('all');
    setSelectStatus('all');
  };

  return (
    <div style={{
      backgroundColor: darkMode ? '#121212' : '#ffffff',
      color: darkMode ? '#f8f9fa' : '#212529',
      minHeight: '100vh',
      transition: 'all 0.3s ease',
      padding: '20px'
    }}>
      <div className='row align-items-center'>
        <div className='col-9'>
          <h2>Hệ Thống Quản Lý Điểm Danh Lớp Học </h2>
        </div>
        <div className='col-3 text-end'>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`btn ${darkMode ? 'btn-light' : 'btn-dark'}`}
            style={{ padding: '6px 12px', cursor: "pointer" }}
          >
            {darkMode ? 'Dark' : 'Night'}
          </button>
        </div>
      </div>

      <div className='row' style={{ margin: "10px 0", padding: "15px 0" }}>
        <div className='col-3'>
          <input type="text"
            className="form-control"
            id="exampleFormControlInput1"
            value={searchName === "all" ? "" : searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Tìm kiếm theo tên sinh viên" />
        </div>
        <div className='col-3'>
          <select className="form-select" value={selectStatus} aria-label="Default select example" onChange={(e) => setSelectStatus(e.target.value)}>
            <option value={"all"}>Tất cả Các trạng thái</option>
            {
              getStatusArray.map((i) => (
                <option value={i} key={i}>{i}</option>
              ))
            }
          </select>
        </div>
        <div className='col-3'>
          <button onClick={handleResetFilters} className="btn" style={{ background: "#f26e21", color: "white", borderRadius: "10px" }}>Reset Bộ Lọc</button>
        </div>
      </div>

      <p className="mt-3">
        Tổng Số bản ghi <strong>{totalRecords}</strong> |
        Có mặt <strong> {presentCount} </strong> |
        Vắng mặt <strong> {absentCount} </strong> |
        Tỷ Lệ đi học <strong> {attendanceRate}% </strong>
      </p>

      <table className={`table ${darkMode ? 'table-dark' : 'table-striped'}`}>
        <thead className="table-danger">
          <tr>
            <th scope="col">STT</th>
            <th scope="col">Mã Lớp</th>
            <th scope="col">Tên Sinh Viên</th>
            <th scope="col">Ngày</th>
            <th scope="col">Trạng Thái</th>
            <th scope="col">Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {filter.map((i, index) => (
            <tr key={i.id} style={{ verticalAlign: 'middle' }}>
              <th scope="row">{index + 1}</th>
              <td>{i.classId}</td>
              <td>{i.name}</td>
              <td>{new Date(i.date).toLocaleDateString('vi-VN')}</td>
              <td>
                <span
                  onClick={() => dispatch({ type: 'TOGGLE_STATUS', payload: i.id })}
                  className={`badge rounded-pill ${i.status === "PRESENT"
                    ? "bg-success-subtle text-success"
                    : "bg-danger-subtle text-danger"
                    }`}
                  style={{ cursor: "pointer", padding: "6px 12px" }}
                >
                  {i.status}
                </span>
              </td>
              <td>
                <button
                  onClick={() => {
                    if (window.confirm(`Bạn có chắc chắn muốn xóa bản ghi của sinh viên ${i.name}?`)) {
                      dispatch({ type: 'DELETE_RECORD', payload: i.id });
                    }
                  }}
                  className="btn btn-danger btn-sm"
                  style={{ borderRadius: "10px" }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
