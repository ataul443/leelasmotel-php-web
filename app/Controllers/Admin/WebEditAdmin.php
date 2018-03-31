<?php

namespace App\Controllers\Admin;
use App\Controllers\Controller;

use Respect\Validation\Validator as v;
use App\Models\Owners;
use App\Models\Price;


class WebEditAdmin extends Controller
{
    private $filecounter;
    public function __construct($container)
    {
        parent::__construct($container);
    }


    public function getWebEdit($req,$res){
        return $this->view->render($res,'admin/webEdit.twig');
    }

    public function postPic($req,$res){
        $filecounter = 0;

        $params = $req->getParams();
        $category = $params['category'];
        $directoryToUpload = __DIR__.'/../../../public/images/'.$category;

        $uploadedFiles = $req->getUploadedFiles();
        $file = $uploadedFiles['example2'];
        $error = null;
        foreach ($uploadedFiles['example2'] as $uploadedFile) {
            $counte = count($uploadedFiles['example2']);
                if($counte >= 4){
                    $error = 'bad';
                    continue;
                }
                $filecounter++;
                $filename= $this->moveUploadedFile($directoryToUpload, $uploadedFile,$filecounter);
                if(!$filename){
                    $error = 'bad';
                }else{
                    $error = 'ok';
                }

        }

        return $res->withJson(['status'=>$error,'category'=>$category]);
    }

    private function moveUploadedFile($directory, \Slim\Http\UploadedFile $uploadedFile,$filecounter)
    {


        $extension = pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);
        $filename = "$filecounter.$extension";

        $uploadedFile->moveTo($directory . DIRECTORY_SEPARATOR . $filename);

        return $filename;
    }

    public function postPrice($req,$res){
        $params = $req->getParams();
        $category = $params['category'];
        $price = (int) $params['price'];

        $error = 'ok';

        if(Price::where('category',$category)->exists()){
            Price::where('category',$category)->update(['price'=>$price]);
            return $res->withJson(['status'=>$error]);
        }else{
            $error = 'bad';
            return $res->withJson(['status'=>$error]);
        }


    }
}