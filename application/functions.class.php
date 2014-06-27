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
                        $paths[] = (string) $entry;
                    }
                }
            }

            return $paths;
        }

        public function loadProjects() {
            $projects = array();
            $xml = simplexml_load_file($this->data);

            foreach($xml as $node) {
                $name = (string) $node->name;
                $title = (string) $node->title;
                $paragraphs = array();

                foreach($node->paragraph as $par) {
                    $paragraphs[] = (string) $par;
                }

                $images = $this->getImagesPaths($name);

                $project = new Project($name, $title, $paragraphs, $images);
                $projects[] = $project;
            }

            return $projects;
        }

    }

}