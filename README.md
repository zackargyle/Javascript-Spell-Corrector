Javascript-Spell-Corrector
==========================

To use:
SpellCorrector spellCheck = new SpellCorrector(inputID);

-----------------------------------------------------------
JQUERY
```
<input type="text" id="input1" />
<h3 id="suggestion"></h3>
```
```
SpellCorrector spellCheck = new SpellCorrector("input1");

var suggestWord = function() {
    var suggestion = spellCheck.suggestSimilarWord();
    $("#suggestion").html(suggestion);
}

$("input1").on("change", suggestWord());
```
-----------------------------------------------------------
AngularJS
```
<input type="text" id="input1" ng-change="suggestWord()" />
<h3> {{suggestion}} </h3>
```
```
SpellCorrector spellCheck = new SpellCorrector("input1");

$scope.suggestWord = function() {
    $scope.suggestion = spellCheck.suggestSimilarWord();
}
```
