import { useState } from "react";
import Router from 'next/router'
import axios from "axios";
import Swal from "sweetalert2";
import styles from './tambah.module.css';

import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

export default function Tambah() {
  const [Id, setId] = useState(makeid(9));
  const [Judul, setJudul] = useState("");
  const [Foto, setFoto] = useState("");
  const [NamaFoto, setNamaFoto] = useState("No file chosen");
  const [Deskripsi, setDeskripsi] = useState("");
  const [Loading, setLoading] = useState(false);

  function makeid(length) {
    var result = "";
    var characters = "0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  function handleInputFoto(e) {
    console.log(e);
    console.log(e.target.files[0]);
    // e.target.files[0]
    const type = e.target.files[0].type;
    console.log(type);
    console.log(type.includes("image"));
    if (type.includes("image")) {
      setFoto(e.target.files[0]);
      setNamaFoto(e.target.files[0].name);
    }else{
        modalNotif("error", 'Gagal Input Foto', "Tipe file tidak didukung");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("submit");
    setLoading(true);

    var formData = new FormData();
    formData.append("Id", Id);
    formData.append("Judul", Judul);
    formData.append("Foto", Foto);
    formData.append("Deskripsi", Deskripsi);

    axios
      .post(`${process.env.NEXT_PUBLIC_API}/simpandatablog`, formData)
      .then((res) => {
        console.log(res);
        setLoading(false);
        if (res.data.Error == 0) {
          modalNotif("success", res.data.Message, "");
          Router.push('/')
        } else {
          modalNotif("error", res.data.Message, "");
        }
      })
      .catch((err) => {
        console.log(err);
        modalNotif("eror", "Terjadi kesalahan pada sistem", "");
      });
  }

  const modalNotif = (type, title, text) => {
    Swal.fire({
      icon: type,
      title: title,
      text: text,
      timer: 1000,
      showConfirmButton: false,
    }).then(() => {});
  };

  return (
    <>
      <div className={styles.divContainer}>
        <div className={styles.divTitle}>TAMBAH</div>
        <form onSubmit={handleSubmit}>
          <div className={styles.divFormGroup}>
            <div className={styles.divLabel}>Judul <div className={styles.required}>*</div></div>
            <div>
              <input
                className={styles.divInput}
                type="text"
                maxLength={200}
                onChange={(e) => setJudul(e.target.value)}
                required
              />
            </div>
          </div>
          <div className={styles.divFormGroup}>
            <div className={styles.divLabel}>Foto <div className={styles.required}>*</div></div>
            <div>
              <input
                type="file"
                id="files"
                onChange={(e) => handleInputFoto(e)}
                accept="image/*"
                style={{ color: "transparent" }}
                required
                className={styles.divInputFile}
              />
              <label for="files">{NamaFoto}</label>
            </div>
          </div>
          <div className={styles.divFormGroup}>
            <div className={styles.divLabel}>Deskripsi <div className={styles.required}>*</div></div>
            <div>
              <textarea
                className={styles.divInputTextarea}
                onChange={(e) => setDeskripsi(e.target.value)}
                name="textarea"
                autoComplete="off"
                rows={10}
                maxLength={2000}
                required
              />
            </div>
          </div>
          <button className={styles.btnSubmit} disabled={Loading} type="submit">
            Simpan
          </button>
        </form>
      </div>

      <Modal
        open={Loading}
        center
        blockScroll={false}
        showCloseIcon={false}
        closeOnOverlayClick={false}
        classNames={{
          overlay: "customOverlay",
          modal: "modalLoader",
        }}
      >
        <div className="loader"></div>
      </Modal>
    </>
  );
}
