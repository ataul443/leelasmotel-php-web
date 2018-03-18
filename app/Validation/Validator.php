<?php
/**
 * Created by PhpStorm.
 * User: devil443
 * Date: 03-Mar-18
 * Time: 9:44 AM
 */

namespace App\Validation;

use Respect\Validation\Validator as Respect;
use Respect\Validation\Exceptions\NestedValidationException;
class Validator
{
    protected $errors;
    public function validate(array $args, array $rules)
    {
        foreach ($rules as $field=>$rule){
            try{
                $rule->setName(ucfirst($field))->assert($args["$field"]);
            } catch (NestedValidationException $e){
                $this->errors[] = $e->getMessages();
            }

        }
        return $this;
    }

    public function failed(){
        if(!empty($this->errors)){
            $_SESSION['validationErrors'] = $this->errors;
        }
        return !empty($this->errors);
    }
}
