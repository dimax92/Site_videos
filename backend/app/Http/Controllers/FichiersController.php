<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Fichiers;
use Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use PDF;

class FichiersController extends Controller
{
    //
    public function store(Request $request, $id)
    {
        $validator = Validator::make($request->all(),[
            'donneesFichier' => 'required|video',
            "nom" => "required|string",
            "description" => "required|string"
            ]
        );

        if($validator->fails()){
            return response()->json($validator->errors(), 401);       
        }

        $fileName = hash("sha256", uniqid()).".".$request->file("donneesFichier")->getClientOriginalExtension();
        Storage::disk("local")->putFileAs("fichiers", $request->file("donneesFichier"), $fileName);
        $fichiers = Fichiers::create([
            "user_id" => $id,
            "nom" => $request->input("nom"),
            "fichier" => $request->input("fichier"),
            "nomfichier" => $fileName,
            "description" => $request->input("description")
        ]);
        return $request->file("donneesFichier")->getClientOriginalExtension();
    }

    public function index()
    {
        return Fichiers::all();
    }

    public function search(Request $request, $search)
    {
        if($search !== "-"){
                return DB::select("SELECT * FROM `fichiers` WHERE filtre_recherche(REPLACE('$search', '-', ' '), CONCAT(`nom`, ' ', `description`)) = 10 ");
        }else{
                return DB::select("SELECT * FROM `fichiers` ");
        }
    }

    public function show($id)
    {
        $fichiers = Fichiers::findOrFail($id);
        return $fichiers;
    }

    public function update(Request $request, $id)
    {
        $userIdRequete = intval($request->input("user_id"));

        $fichiers = Fichiers::firstWhere('id','=',$id);

        $userIdUpdate = $fichiers->user_id;

        $validator = Validator::make($request->all(),[
            "nom" => "required|string",
            "description" => "required|string"
            ]
        );

        if($validator->fails()){
            return response()->json($validator->errors(), 401);       
        }

        if($userIdRequete === $userIdUpdate){
            if($request->hasFile('donneesFichier')){
                $validatorFile = Validator::make($request->all(),[
                    'donneesFichier' => 'required|video'
                    ]
                );
        
                if($validatorFile->fails() OR $validator->fails()){
                    return response()->json([$validatorFile->errors(), $validator->errors()], 401);       
                }
                $nomFichier = $fichiers->nomfichier;
                $fileName = hash("sha256", uniqid()).".".$request->file("donneesFichier")->getClientOriginalExtension();
                Storage::delete("fichiers/".$nomFichier);
                Storage::disk("local")->putFileAs("fichiers", $request->file("donneesFichier"), $fileName);
                $fichiers->update([
                    "fichier" => $request->input("fichier"),
                    "nomfichier" => $fileName
                ]);
            }else{
                if($validator->fails()){
                    return response()->json($validator->errors(), 401);       
                }
            }
    
            $fichiers->update([
                "nom" => $request->input("nom"),
                "description" => $request->input("description")
            ]);
            return response()->json(["message" => "modifier"], 201);  
        }else{
            return response()->json(["message" => "echec modification"], 401);  
        }

    }

    public function destroy(Request $request, $id)
    {
        $userIdRequete = intval($request->input("user_id"));
        $fichiers = Fichiers::firstWhere('id','=',$id);
        $userIdUpdate = $fichiers->user_id;

        if($userIdRequete === $userIdUpdate){
            $nomFichier = $fichiers->nomfichier;
            Storage::delete("fichiers/".$nomFichier);
            $fichiers->delete();
            return response()->json(["message" => "supprimer"], 201);  
        }else{
            return response()->json(["message" => "echec suppression"], 401);  
        }
    }

    public function mesFichiers($id)
    {
        return DB::select("SELECT * FROM `fichiers` WHERE `user_id` = '$id' ");
    }

    public function download($id)
    {
        $fileName = Fichiers::findOrFail($id)->nomfichier;
        return Storage::download("fichiers/".$fileName);
    }

}