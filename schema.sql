-- Modify this code to update the DB schema diagram.
-- To reset the sample schema, replace everything with
-- two dots ('..' - without quotes).

CREATE TABLE dog (
    dog_id SERIAL   NOT NULL,
    breed varchar(255)   NOT NULL,
    temperament varchar(255)   NULL,
    weight varchar(100)   NULL,
    height varchar(100)   NULL,
  	life_span varchar(100)   NULL,
    CONSTRAINT "pk_dog" PRIMARY KEY (
        "dog_id"
     )
);

CREATE TABLE votes (
    vote_id SERIAL   NOT NULL,
    dog_id SERIAL   NOT NULL,
    votes int   NOT NULL,
    CONSTRAINT "pk_votes" PRIMARY KEY (
       	vote_id
    )
);

CREATE TABLE images (
    image_id SERIAL   NOT NULL,
    dog_id int   NOT NULL,
    url varchar(255)   NOT NULL,
    CONSTRAINT "pk_images" PRIMARY KEY (
       	image_id
     )
);

ALTER TABLE votes ADD CONSTRAINT fk_Votes_dog_id FOREIGN KEY(dog_id)
REFERENCES dog (dog_id);

ALTER TABLE images ADD CONSTRAINT fk_Images_dog_id FOREIGN KEY(dog_id)
REFERENCES dog (dog_id);