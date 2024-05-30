import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import StarRatingComponent from 'react-star-rating-component';


const IndividualProduct = () => {
  // All of the state variables
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [remainingChars, setRemainingChars] = useState(100);
  const [isReviewFormVisible, setIsReviewFormVisible] = useState(false);
  const [reviews, setReviews] = useState([]);

  // Function to handle form submission
  const handleCancelReview = () => {
    setIsReviewFormVisible(false);
    setRating(0);
    setReviewContent('');
    setRemainingChars(100);
  };

  // Function to handle review content change
  const handleReviewContentChange = (e) => {
    setReviewContent(e.target.value);
    setRemainingChars(100 - e.target.value.length);
  };

  // Fetch the product data from the backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/product/select/${productId}`);

        // Set the product state variable
        setProduct(response.data);
      // Catch for error in fetching product
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [productId]);

  // Fetch the reviews for the product
  useEffect(() => {
    const fetchReviews = async () => {
      const response = await axios.get(`http://localhost:4000/api/review/${productId}`);
      setReviews(response.data);
    };
  
    fetchReviews();
  }, [productId]);

  // Function to handle form submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    // Here you can implement logic to submit the review to the backend
    console.log('Review Submitted:', {
      productId,
      reviewerName,
      rating,
      reviewContent
    });
    // Clear form fields after submission
    setReviewerName('');
    setRating(0);
    setReviewContent('');
  };

  const navigate = useNavigate();  
  // Function to handle login
  const handleLogin = () => {
    setIsLoggedIn(true);
    //navigate('/login');
  };

  // Loading message for product
  if (!product) {
    return <div>Loading...</div>;
  }

  // Function to handle star rating
  const onStarClick = (nextValue) => {
    setRating(nextValue);
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center mt-4">
        <div className="col-md-8">
          <div className="card custom-form">
            <div className="card-body">
              <div className="row">

                {/* Product image */}
                <div className="col-md-4">
                  <div className="card-img-container">
                  <img src={`/${product.imgUrl}`} alt={product.productName} className="card-img" />
                  </div>
                </div>

                {/* Product details */}
                <div className="col-md-8">

                  {/* Product name */}
                  <div className="text-center mb-4">
                    <h1 className="mb-2 fs-4">{product.productName}</h1>
                  </div>

                  {/* Product description */}
                  <p>{product.productDescription}</p>

                  {/* Product price */}
                  <p>Price: ${product.price}</p>
                  <button className="btn custom-button mt-3">
                    Add to Cart
                  </button>

                  {/* Review form */}
                  {isLoggedIn ? (
                    <>
                    <button className="btn custom-button mt-3" onClick={() => setIsReviewFormVisible(true)}>
                    Write a Review
                  </button>
                  {isReviewFormVisible && (

                    // Review form
                    <form onSubmit={handleReviewSubmit} className="mt-4">
                      <h3 className="mb-2">Write a Review</h3>

                      {/* Reviewer name */}
                      <div className="form-group" style={{ display: 'flex', alignItems: 'center' }}>
                        <label htmlFor="rating" style={{ marginRight: '5px' }}>Rating:</label>
                        <StarRatingComponent 
                          name="rating" 
                          starCount={5}
                          value={rating}
                          onStarClick={onStarClick}
                          renderStarIcon={() => <span style={{ fontSize: '20px' }}>★</span>}
                        />
                      </div>

                      {/* Review content */}
                      <div className="form-group">
                        <label htmlFor="reviewContent" className="mb-1">Your Review:</label>
                        <textarea
                          id="reviewContent"
                          className="form-control"
                          value={reviewContent}
                          onChange={handleReviewContentChange}
                          maxLength={100}
                          onClick={() => setRemainingChars(100 - reviewContent.length)}
                        ></textarea>

                        {/* Remaining characters */}
                        <div style={{ height: '1.5em' }}>
                          {remainingChars < 100 && (
                            <small className="form-text text-muted">
                              {remainingChars} characters remaining
                            </small>
                          )}
                        </div>
                      </div>

                      {/* Submit button */}
                      <button type="submit" className="btn custom-button mt-2">
                        Submit Review
                      </button>

                      {/* Cancel button */}
                      <button type="button" className="btn custom-button mt-2" onClick={handleCancelReview}>
                        Cancel Review
                      </button>
                    </form>
                  )}
                  </>
                  ) : (

                    // Message to log in to leave a review
                    <div className="mt-4">
                      <p>You must be logged in to leave a review.</p>
                      <button className="btn btn-primary" onClick={handleLogin}>
                        Log In
                      </button>
                    </div>
                  )}

                  {/* Reviews */}
                  <h3>Reviews</h3>
                    {reviews.length === 0 ? (
                      <p>No reviews yet. Be the first to write a review!</p>
                    ) : (
                      reviews.map((review, index) => (
                        <div key={index} className="mb-3">
                          <div>Rating: {review.rating} / 5</div>
                          <div>{review.content}</div>
                          <div>Reviewed by: {review.user.username}</div>
                        </div>
                      ))
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualProduct;
