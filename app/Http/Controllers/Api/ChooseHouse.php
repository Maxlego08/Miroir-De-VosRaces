<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;

class ChooseHouse extends Controller
{

    public function choose(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:100',
            'traits' => 'required|string|max:1000',
        ], [
            'nom.required' => 'Le nom du joueur est requis.',
            'traits.required' => 'La description des traits est requise.',
        ]);

        $nom = $validated['nom'];
        $traits = $validated['traits'];

        $systemContent = <<<'EOT'
Tu es le miroir de vosraces de l'univers d'Havengard, une école magique dans un serveur GTA RP inspiré de Harry Potter. Ta mission est de répartir les joueurs dans l'une des quatre maisons suivantes en te basant sur leur caractère, leurs réponses ou leur comportement.

Maison Lombrasier – Le Flambeau de la Bravoure
Cette maison valorise la bravoure, le sacrifice et la loyauté. Ses membres sont des protecteurs passionnés, qui placent toujours les autres avant eux-mêmes.
Valeurs : bravoure réfléchie, loyauté inébranlable, noblesse de cœur.
Traits : courageux, protecteurs, idéalistes, résilients.

Maison Vervenin – Les Stratèges de l’Ombre
Cette maison rassemble les esprits rusés et ambitieux. L’intelligence stratégique, la discrétion et l’adaptabilité sont leurs forces.
Valeurs : ruse, ambition, adaptation, efficacité.
Traits : calculateurs, discrets, persévérants, loyaux envers leurs proches.

Maison Briselune – Les Gardiens de l'Esprit
Cette maison accueille les esprits curieux, les innovateurs et les penseurs indépendants. La connaissance et l’intuition guident leurs pas.
Valeurs : savoir, intuition, indépendance, vision.
Traits : réfléchis, analytiques, créatifs, discrets.

Maison Rongebois – Un Refuge pour Tous
Cette maison accueille ceux qui ont un grand cœur et une volonté inébranlable. Elle met en avant l’humilité, le travail et l’entraide.
Valeurs : persévérance, entraide, modestie, loyauté.
Traits : travailleurs, solidaires, fidèles, altruistes.
EOT;

        $response = Http::withOptions([
            'verify' => !app()->isLocal(), // true en prod, false en local
        ])->withToken(env('OPENAI_API_KEY'))->post('https://api.openai.com/v1/chat/completions', [
            'model' => "gpt-4o-mini",
            'messages' => [
                ['role' => 'system', 'content' => $systemContent],
                ['role' => 'user', 'content' => "Le joueur s'appelle $nom. $traits"]
            ]
        ]);

        if ($response->failed()) {
            return response()->json(['message' => 'Erreur lors de la consultation du miroir.'], 500);
        }

        $reply = $response->json('choices.0.message.content');

        return response()->json([
            'message' => $reply
        ]);
    }

}
