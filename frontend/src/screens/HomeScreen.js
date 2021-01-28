import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, CardColumns } from 'react-bootstrap'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import NavPills from '../components/NavPills'
import ProductCarousel from '../components/ProductCarousel'
import Meta from '../components/Meta'
import { listProducts } from '../actions/productActions'

const HomeScreen = ({ match }) => {
  const keyword = match.params.keyword

  const pageNumber = match.params.pageNumber || 1

  const dispatch = useDispatch()

  const productList = useSelector((state) => state.productList)
  const { loading, error, products, page, pages } = productList

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber))
  }, [dispatch, keyword, pageNumber])

  return (
    <>
      <Meta />

      <>
        {!keyword ? (
          <>
            {' '}
            <ProductCarousel />
            {/* <NavPills /> */}
          </>
        ) : (
          <Link to='/' className='btn btn-light'>
            Regresar
          </Link>
        )}
      </>

      <h1>Últimas novedades</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <CardColumns>
            {/* <Row> */}
            {products.map((product) => (
              // <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product key = {product} product={product} />
              // </Col>
            ))}
            {/* </Row> */}
          </CardColumns>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ''}
          />
        </>
      )}
    </>
  )
}

export default HomeScreen
