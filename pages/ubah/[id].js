import { useState } from "react";
import FormData from "form-data";

import Router from 'next/router'
import axios from "axios";
import Swal from "sweetalert2";
import styles from './ubah.module.css';

import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

export default function Ubah(props) {
  const [detailBlog, setDetailBlog] = useState(props.detailBlog);
  const [Id, setId] = useState(props.detailBlog[0].Id || "");
  const [Judul, setJudul] = useState(props.detailBlog[0].Judul || "");
  const [Foto, setFoto] = useState("");
  const [NamaFoto, setNamaFoto] = useState(getNamaFoto(props.detailBlog[0].Foto) || "");
  const [Deskripsi, setDeskripsi] = useState(props.detailBlog[0].Deskripsi || "");
  const [Loading, setLoading] = useState(false);

  function getNamaFoto(fileName){
    if(fileName == "" || fileName == undefined){
      return false
    }
    const last = fileName.lastIndexOf("/");
    const result = fileName.substring(last+1);
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
      .post(`${process.env.NEXT_PUBLIC_API}/ubahdatablog`, formData)
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
        <div className={styles.divTitle}>UBAH</div>
        <form onSubmit={handleSubmit}>
          <div className={styles.divFormGroup}>
            <div className={styles.divLabel}>Judul <div className={styles.required}>*</div></div>
            <div>
              <input
                className={styles.divInput}
                type="text"
                maxLength={200}
                value={Judul}
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
                value={Deskripsi}
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

export async function getServerSideProps(context) {
  console.log(context);
  try {
    const { id } = context.params;
    let formData = new FormData();
    formData.append("Id", id);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/getdetailblog`,
      {
        body: formData,
        method: "POST",
      }
    );
    const result = await response.json();
    const detailBlog = await result.getDetailBlog;
    return {
      props: { detailBlog },
    };
  } catch (err) {
    return { props: { detailBlog: [] } };
  }
}
