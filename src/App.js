import logo from './logo.svg';
import './App.css';
import { initialAttendances } from './db';
import useLocalStorage from './hook/useLocalStorage';
import { useState } from 'react';
function App() {
  //chueyen doi  trag thai giao dien sang toi
  //feature 1 :attendence Tablebe Managerment (useReducer)
  //display data action toggle status :Click on the statsu lable of a row to switch betwween present - Absent
  //Deleted record : button delete for each row with a window.confirm prompt for verification
  const [darkMode, setDarkMode] = useState("true")
  const [searchName, setSearchName] = useState('all');
  const [selectStatus, setSelectStatus] = useState('all');
  const getStatusArray = [...new Set(initialAttendances.map((s) => s.status))]
  console.log(getStatusArray);
  const getLengtAbsent = initialAttendances.filter((c) => c?.status === selectStatus || selectStatus == "all")
  const filter = initialAttendances.filter((c) => {
    const matchName = searchName === "all" || c?.name.toLowerCase().includes(searchName.toLowerCase());
    const matchStatus = c?.status === selectStatus || selectStatus == "all"
    return matchName && matchStatus;
  })
  console.log(filter);

  return (
    <div >
      <div className='row'>
        <div className='col-9'>
          <h2>Hệ Thống Quản Lý Điểm Danh Lớp Học </h2>
        </div>
        <div className='col-3'>
          <button style={{ padding: '6px 12px', cursor: "pointer" }}>
            {/* {darkMode? dark : light} */}
            Dark
          </button>
        </div>

      </div>

      <div className='row' style={{ margin: "10px ", padding: "30px" }}>
        <div className='col-3'>
          <input type="text"
            class="form-control"
            id="exampleFormControlInput1"
            value={searchName === "all" ? "" : searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Tìm kiếm theo tên sinh viên" />
        </div>
        <div className='col-3'>
          <select className="form-select" aria-label="Default select example" onChange={(e) => setSelectStatus(e.target.value)}>
            <option value={"all"}>Tất cả Các trạng thái</option>
            {
              getStatusArray.map((i) => (
                <option value={i} key={i}>{i}</option>
              ))
            }
          </select>

        </div>
        {/* xu ly su kien onclick rest bo loc thi tra ve all thanh tim kiem ko co gi select cung rest luo */}
        <div className='col-3'>
          <button style={{ background: "#f26e21", borderRadius: "10px" }}>Reset Bộ Lọc</button>
        </div>
      </div>
      {/* Feature 3 Dashboarch :display a summary icludeing total number attendance records
      total number Present records
        tinh ti le phan tram di hoc
      */}
      <p>Tổng Số bản ghi <strong>{filter.length}</strong> Có măt <strong>1</strong> vắng mặt <strong>2</strong> Tỷ Lệ đi học <strong></strong>  </p>
      {/* Table */}
      <table class="table">
        <thead class="table-danger">
          <tr>
            <th scope="col">STT</th>
            <th scope="col">Mã Lớp</th>
            <th scope="col">Tên Sinh Viên</th>
            {/* Fomat Date */}
            <th scope="col">Ngày</th>
            <th scope="col">Trạng Thái</th>
            <th scope="col">Thao Tác</th>

          </tr>
        </thead>
        {filter.map((i, index) => (
          <tbody>
            <tr key={i.id} >
              <th scope="row">{index + 1}</th>
              <td>{i.classId}</td>
              <td>{i.name}</td>
              <td>{i.date}</td>

              <td >
                <span
                  className={`badge rounded-pill ${i.status === "PRESENT"
                    ? "bg-success-subtle text-success"
                    : "bg-danger-subtle text-dark"
                    }`}
                  style={{ marginRight: "25px" }}
                >
                  {i.status}
                </span>

              </td>
              <td >

                <button style={{ background: "Red", color: "#fff", border: "1px solid gray", borderRadius: "10px", margin: "10px" }}>Xóa</button>
              </td>
            </tr>
          </tbody>
        ))}

      </table>

    </div>

  );
}

export default App;
