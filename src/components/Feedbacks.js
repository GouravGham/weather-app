import React, { useState } from "react";

function Feedbacks({ feedback, addFeedback, handleChange, name, message, fileInputRef }) {
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e) => {
    addFeedback(e);
    setShowModal(false);
  };

  return (
    <div className="feedbacks-container">
      <h2>Share Your Local Weather</h2>
      <button className="width-fit" onClick={() => setShowModal(true)}>Share Weather</button>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <h2>Add Feedback</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="image">Image:</label>
                <input
                  type="file"
                  id="image"
                  onChange={handleChange}
                  accept="image/*"
                  name="Image"
                  ref={fileInputRef}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message:</label>
                <textarea
                  id="message"
                  value={message}
                  name="message"
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button className="width-fit" type="submit">Share</button>
            </form>
          </div>
        </div>
      )}
      <div className="existing-feedbacks">
      {feedback.length>0 && (<h3>Weather Feedbacks in {feedback[0].city}</h3>)}
      <div className="feedback-cards">
          {feedback.sort((a, b) => new Date(b.date) - new Date(a.date)).map((ws) => (
            <div className="feedback-card" key={ws.id}>
              <img src={ws.Image} alt="image" />
              <p className="date">{ws.date}</p>
              <p className="message">{ws.message}</p>
              <p className="author">- {ws.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Feedbacks;
