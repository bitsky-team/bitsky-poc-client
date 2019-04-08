import React, {useState} from 'react'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter, Progress,
} from 'reactstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTimes, faDownload} from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import {config} from '../../../config'
import qs from 'qs'
import fileDownload from 'js-file-download'
import {toast} from 'react-toastify'
import styled from 'styled-components'

const ProgressBar = styled(Progress)`
  && .progress-bar {
    background: linear-gradient(45deg, #A5CDF5 0, #83B2E0 100%);
  }
`

const AdministrationFileDownloadModal = ({isOpen, toggle, fileName, path}) => {

  const [isDownloading, setIsDownloading] = useState(false)
  const [loadingText, setLoadingText] = useState('')
  const [percentCompleted, setPercentCompleted] = useState(0)

  const downloadItem = async name => {
    setIsDownloading(true)
    setPercentCompleted(0)
    setLoadingText('Récupération du fichier...')
    await axios.post(
      `${config.API_ROOT}/download_item`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
        path: path || null,
        name: name,
      }), {
        responseType: 'blob',
        onUploadProgress: progressEvent => {
          setPercentCompleted(Math.round((progressEvent.loaded * 100) / progressEvent.total))
        },
      },
    ).then(response => {
      if (response.data) {
        fileDownload(response.data, name)
        setIsDownloading(false)
      } else {
        toast.error('Le(s) fichier(s) n\'a/ont pas pu être téléchargé(s) !', {
          autoClose: 5000,
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      }
    })
  }

  return (
    <div>
      <Modal isOpen={isOpen} toggle={toggle} className="user-modal">
        <ModalHeader toggle={toggle}>Télécharger un fichier</ModalHeader>
        <ModalBody>
          {isDownloading ? (
            <div>
              <div className="text-center">{percentCompleted}%</div>
              <ProgressBar value={percentCompleted}/>
              <small>{loadingText}</small>
            </div>
          ) : null}
          {`Voulez-vous télécharger le fichier ${fileName} ?`}
        </ModalBody>
        <ModalFooter>
          <Button className="modal-choice"
                  color="primary" onClick={() => downloadItem(fileName)}>
            <FontAwesomeIcon icon={faDownload}/>
          </Button>
          <Button className="modal-choice"
                  color="secondary" onClick={toggle}>
            <FontAwesomeIcon icon={faTimes}/></Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default AdministrationFileDownloadModal