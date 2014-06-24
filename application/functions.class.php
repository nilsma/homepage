<?php
if(!class_exists('Functions')) {

    class Functions {

        protected $dir;
        protected $data;

        public function __construct() {
            $this->dir = realpath($_SERVER['DOCUMENT_ROOT']) . '/../projects';
            $this->data = $this->dir . '/projects.xml';
        }

        public function getImagesPaths($name) {
            $path = realpath($_SERVER['DOCUMENT_ROOT']) . '/images/projects/' . $name;
            $paths = array();

            if($handle = opendir($path)) {
                while(false !== ($entry = readdir($handle))) {

                    if($entry === '.' || $entry === '..') {
                        continue;
                    } else {
                        $paths[] = $entry;
                    }
                }
            }

            return $paths;
        }

        public function loadProjects() {
            $projects = array();
            $xml = simplexml_load_file($this->data);

            foreach($xml as $node) {
                $name = $node->name;
                $title = $node->title;
                $paragraphs = array();

                foreach($node->paragraph as $par) {
                    $paragraphs[] = $par;
                }

                $images = $this->getImagesPaths($name);

                $project = new Project($name, $title, $paragraphs, $images);
                $projects[] = $project;
            }

            return $projects;
        }

    }

}