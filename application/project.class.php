<?php
if(!class_exists('Project')) {

    class Project {

        protected $name;
        protected $title;
        protected $paragraphs;
        protected $images;

        public function __construct($name, $title, $paragraphs, $images) {
            $this->name = $name;
            $this->title = $title;
            $this->paragraphs = $paragraphs;
            $this->images = $images;
        }

        public function getName() {
            return $this->name;
        }

        public function getTitle() {
            return $this->title;
        }

        public function getParagraphs() {
            return $this->paragraphs;
        }

        public function getImages() {
            return $this->images;
        }

    }

}