<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChooseHouse extends Controller
{

    public function choose(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|min:3',
            'origin' => 'required|string|max:1000|min:50',
            'personality' => 'required|string|max:1000|min:50',
            'ambitions' => 'required|string|max:1000|min:50',
        ], [
            'name.required' => 'Le nom du joueur est requis.',
            'origin.required' => 'Les origines du joueur sont requises.',
            'personality.required' => 'La description de la personnalité est requise.',
            'ambitions.required' => 'Les ambitions du joueur sont requises.',
        ]);

        // Réponse de test
        if (env('FAKE_RESPONSE')) {
            $fakeResponse = "Ô, Zeeva, douce âme errante dans les couloirs magiques d'Havengard. Je vois les éclats de lumière qui habitent ton cœur, une chaleur palpable émanant de ta bonté. Tes chants, tels des murmures enchantés, s'élèvent au-dessus des brouhahas du quotidien, apportant réconfort et joie à ceux qui t'entourent. La mélodie de ta voix n'est pas seulement une mélodie, mais un écho de ta bienveillance innée. Ton amour pour l'apprentissage, ta soif de connaissance, illuminent ta voie et révèlent une curiosité profonde. Oh, quel bonheur de voir une âme si impliquée dans la quête du savoir, désireuse d'explorer chaque recoin de la sagesse. Et lorsque l'impulsion d'aider tes amis se manifeste, c'est là que véritablement ton essence brille, comme la lueur d'une étoile dans la nuit sombre. Avec cette loyauté et ce dévouement qui te définissent, tu te dresses comme un pilier pour tes camarades, toujours prête à tendre la main, à soutenir ceux qui en ont besoin. Mais sache, chère Zeeva, que ce que tu embodies se mêle aussi à l'esprit tumultueux du travail acharné, l'altruisme tissé dans la toile de ton être. Ainsi, après avoir contemplé ton cœur et ton esprit, révélons le tapis tissé des possibilités. À quelle maison destin est-il temps de te confier ? La réponse se dessine dans les ombres et les lumières : Tu iras à Rongebois !";
            sleep(1);
            return $this->getResponse($fakeResponse);
        }

        $name = $validated['name'];
        $origin = $validated['origin'];
        $personality = $validated['personality'];
        $ambitions = $validated['ambitions'];

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

        $userPrompt = <<<EOT
Tu es un ancien miroir magique, mystérieux et solennel, dans l'univers RP d'Havengard, une école magique. Tu parles directement au joueur comme si tu le regardais dans les yeux. Ton discours doit être fluide, immersif, ancien, mais uniquement constitué de ce que le miroir dit à haute voix. Ne décris rien. N’utilise pas d’astérisques, ni de narration, ni de mise en scène. Pas de * ni de parenthèses. Juste du discours parlé. Termine toujours par une phrase seule, claire et solennelle qui indique dans quelle maison va le joueur, par exemple : "Tu iras à Rongebois !"

Le joueur se nomme $name.

Voici ce que tu sais à son sujet :

- Origines : $origin
- Personnalité : $personality
- Ambitions : $ambitions

Analyse ces trois aspects, puis prononce le verdict du miroir avec mystère et gravité. N’écris que ce que le miroir dit à voix haute.
EOT;


        $response = Http::withOptions([
            'verify' => !app()->isLocal(), // true en prod, false en local
        ])->withToken(env('OPENAI_API_KEY'))->post('https://api.openai.com/v1/chat/completions', [
            'model' => "gpt-4o-mini",
            'messages' => [
                ['role' => 'system', 'content' => $systemContent],
                ['role' => 'user', 'content' => $userPrompt]
            ]
        ]);

        if ($response->failed()) {
            return response()->json(['message' => 'Erreur lors de la consultation du miroir.'], 500);
        }

        $reply = $response->json('choices.0.message.content');

        return $this->getResponse($reply);
    }

    private function getResponse($result)
    {
        $house = $this->getHouseFromResult($result);
        return response()->json([
            'message' => $result,
            'house' => $house
        ]);
    }

    private function getHouseFromResult($result)
    {
        $result = strtolower($result);
        if (strpos($result, 'briselune') !== false) {
            return 'briselune';
        } elseif (strpos($result, 'vervenin') !== false) {
            return 'vervenin';
        } elseif (strpos($result, 'rongebois') !== false) {
            return 'rongebois';
        } elseif (strpos($result, 'lombrasier') !== false) {
            return 'lombrasier';
        }
        return null;
    }

}
