<?php

include '../../application/functions.class.php';
include '../../application/project.class.php';

$return_data = array();

$func = new Functions();
$projects = $func->loadProjects();

foreach($projects as $project) {
    $project_data = array(
        'name' => $project->getName(),
        'title' => $project->getTitle(),
        'paragraphs' => $project->getParagraphs(),
        'images' => $project->getImages(),
        'link' => $project->getLink()
    );

    $return_data[] = $project_data;
}

header('Content-type: application/json');
echo json_encode($return_data, JSON_FORCE_OBJECT);

?>