Javascript-Spell-Corrector
==========================

To use:

SpellCorrector.suggestSimilarWord(inputID, outputID);

-----------------------------------------------------------
JQUERY
```
<input type="text" id="input1" />
<h3 id="output1"></h3>
```
```

var suggestWord = function() {
    SpellCorrector.suggestSimilarWord("input1","output1");
}

$("#input1").on("change", suggestWord());
```
-----------------------------------------------------------
AngularJS
```
<input type="text" id="input1" ng-change="suggestWord()" />
<h3> {{suggestion}} </h3>
```
```

$scope.suggestWord = function() {
    $scope.suggestion = spellCheck.suggestSimilarWord("input1");
}
```
