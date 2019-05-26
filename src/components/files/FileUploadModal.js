import React, {useCallback, useState} from 'react'
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Progress} from 'reactstrap'
import {useDropzone} from 'react-dropzone'
import styled from 'styled-components'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTimes, faUpload} from '@fortawesome/free-solid-svg-icons'
import {config} from '../../config'
import qs from 'qs'
import axios from 'axios'
import {toast} from 'react-toastify'

const UploadButton = styled(Button)`
  background-color: rgb(131, 178, 224);
  border-color: rgb(131, 178, 224);
  padding: 3px 12px 3px 12px;
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 30px;
`
const FileContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const FileInfos = styled.div`
  border-top: 1px solid rgb(97, 97, 97);
  border-bottom: 1px solid rgb(97, 97, 97);
  padding: 10px;
  margin: 10px;
  width: fit-content;
  text-align: left;
  border-radius: 5px;
`

const List = styled.ul`
  margin-bottom: 0;
`

const ProgressBar = styled(Progress)`
  && .progress-bar {
    background: linear-gradient(45deg, #A5CDF5 0, #83B2E0 100%);
  }
`

const FileUploadModal = ({isOpen, toggle, path, setFiles, chosenDevice}) => {

  const [forceCloseModal, setForceCloseModal] = useState(false)
  const [filesList, setFilesList] = useState(null)
  const [filesToUpload, setFilesToUpload] = useState([])
  const [isUploaded, setIsUploaded] = useState(false)
  const [loadingText, setLoadingText] = useState(null)
  const [percentCompleted, setPercentCompleted] = useState(0)

  const readFile = (file) => {
    setLoadingText(`Récupération du fichier ${file.name}`)
    const reader = new FileReader()

    reader.onload = (e) => {
      let newFiles = filesToUpload

      const fileData = {}
      fileData[file.name] = e.target.result

      newFiles.push(fileData)
      setFilesToUpload(newFiles)
      setLoadingText(null)
    }

    if (filesToUpload.length < 10) {
      reader.readAsDataURL(file)
    } else {
      alert('Trop de fichiers ! 10 maximum')
    }
  }

  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach(file => {
      readFile(file)
    })
    setFilesList(acceptedFiles.map((file, i) => <li key={i}>{file.name}</li>))
    setIsUploaded(true)
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  const uploadFiles = async () => {
    setLoadingText('Envoi des fichiers...')

    const response = await axios.post(
` ${config.API_ROOT}/upload_files`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
        path: path || null,
        files: filesToUpload,
        device: chosenDevice,
        bitsky_ip: localStorage.getItem('selected_device') || undefined
      }), {
        onUploadProgress: progressEvent => {
          setPercentCompleted(Math.round((progressEvent.loaded * 100) / progressEvent.total))
        },
      },
    )
    const {success} = response.data

    if (success) {
      toast.success('Votre fichier a bien été uploadé !', {
        autoClose: 5000,
        position: toast.POSITION.BOTTOM_RIGHT,
        className: 'notification-success',
      })
      setFilesToUpload([])
      setLoadingText(null)
      setPercentCompleted(0)
      setFiles()
      setIsUploaded(false)
      forceClose()
    } else {
      toast.error('Le(s) fichier(s) n\'a/ont pas pu être uploadé(s) !', {
        autoClose: 5000,
        position: toast.POSITION.BOTTOM_RIGHT,
      })
    }
  }

  const forceClose = () => {
    setForceCloseModal(true)
    setTimeout(() => toggle(), 1000)
  }

  return (
    <div>
      <Modal isOpen={forceCloseModal ? false : isOpen} toggle={forceClose} className="user-modal">
        <ModalHeader toggle={toggle}>Uploader un fichier</ModalHeader>
        <ModalBody>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ?
              <small>Déposez le fichier ici ...</small> :
              <div>
                <div>
                  {loadingText &&
                  <div>
                    <div className="text-center">{percentCompleted}%</div>
                    <ProgressBar value={percentCompleted}/>
                    <small>{loadingText}</small>
                  </div>
                  }
                  <UploadButton color="info">Glisser ou sélectionner un fichier</UploadButton>
                </div>
                {isUploaded && (
                  <FileContainer>
                    <div>
                      <h5>Fichiers importés</h5>
                    </div>
                    <FileInfos>
                      <List>
                        {filesList}
                      </List>
                    </FileInfos>
                  </FileContainer>
                )}
              </div>
            }
          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="modal-choice"
                  color="primary" onClick={uploadFiles} disabled={!isUploaded}>
            <FontAwesomeIcon icon={faUpload}/>
          </Button>
          <Button className="modal-choice"
                  color="secondary" onClick={toggle}>
            <FontAwesomeIcon icon={faTimes}/></Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default FileUploadModal