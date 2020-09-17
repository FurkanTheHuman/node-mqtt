import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CPagination
} from '@coreui/react'
import axios from 'axios'

import usersData from './UsersData'

const getBadge = status => {
  switch (status) {
    case 'Active': return 'success'
    case 'Inactive': return 'secondary'
    case 'Pending': return 'warning'
    case 'Banned': return 'danger'
    default: return 'primary'
  }
}

const Users = () => {
  /*const history = useHistory()
  const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
  const [page, setPage] = useState(currentPage)

  const pageChange = newPage => {
    currentPage !== newPage && history.push(`/users?page=${newPage}`)
  }

  useEffect(() => {
    currentPage !== page && setPage(currentPage)
  }, [currentPage, page])
*/
const [data, setData] = useState({"users":[]});
    useEffect(async () => {
        const fetchData = async () => {
            const result2 = await axios.get('/api/users/')
            console.log(result2.data.data)
            return {"users":result2.data.data};
        }
        var ss = fetchData().then((res)=>{
            console.log(res)
            return res
        }).catch(()=>{
            console.log("Not auth")
        })

        setData(await ss)
        console.log(await ss)
    }, [setData])
    console.log(data['users'].map((e) =>  <li>{e}</li>))

  return (
    <CRow>
      <CCol xl={6}>
        <CCard>
          <CCardHeader>
            Users
          </CCardHeader>
          <CCardBody>
              {data['users'].map((e) =>  <li key={'key'+e.email}>{e.email}</li>)}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Users
