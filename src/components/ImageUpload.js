import React from "react";
import ImageUploader from "react-images-upload";

export default class ImgUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pictures: [] };
  }

  render() {
    return (
      <div>
        {this.props.pictures.length > 0 ? (
          <div
            className="upload-image-container"
            onClick={() => {
              this.props.removePics();
            }}
          >
            <img
              src={URL.createObjectURL(
                this.props.pictures[this.props.pictures.length - 1]
              )}
              className="upload-image-preview"
            />
            <div className="text-block">
              <p>Click to remove</p>
            </div>
          </div>
        ) : (
          false
        )}
        <ImageUploader
          buttonText="Upload Image"
          onChange={this.props.onDrop}
          imgExtension={[".jpg", ".gif", ".png", ".gif"]}
          maxFileSize={5242880}
          singleImage={true}
          label=""
          withIcon={false}
          labelClass="bg-secondary"
        />
      </div>
    );
  }
}
