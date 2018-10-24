angular.module('bMaxMention', []).controller('MentionCtrl', ($scope, $http, $q) => {
    $scope.isMention = false;
    $scope.elements = [{}, {}];
    $scope.listElements;
    $scope.currentTarget;
    const bMaxMentionMenu = $('.bMaxMentionMenu');
    var position = 0;


    $('.mention').on('input',(e)=>{
        alert(e);
    })

    $scope.bMaxMention = (event) => {
        $scope.currentTarget = $(event.currentTarget)[0]
        if (event.which == 50) {
            $scope.isMention = true;
        }
        if ($scope.isMention) {
            populateArray().then((resp) => {
                $scope.listElements = resp.data.data;
            });

            setTimeout(() => {
                const coords = getCaretPosition($scope.currentTarget, position)
                /*------------------if you dont get correct position use 1st section and comment 2nd section-------------*/
                /*
                 ===============================1 st section==============================================

                bMaxMentionMenu[0].style.top = coords.y + $(event.currentTarget).position().top + 10 + 'px';
                  bMaxMentionMenu[0].style.left = coords.x + $(event.currentTarget).position().left + 'px';*/
                /**
                 ================================2nd section================================================
                 */
                bMaxMentionMenu[0].style.top = coords.y + 'px';
                bMaxMentionMenu[0].style.left = coords.x + 'px';

                bMaxMentionMenu[0].style.display = "block";
            }, 0)
        }

    }

    $scope.bMaxMentionSelect = (event) => {
        position = $scope.currentTarget.selectionStart;
        var beforeText = $($scope.currentTarget).val();
        var newText = $(event.currentTarget).text();
        $($scope.currentTarget).val(beforeText.substring(0, position) + newText + beforeText.substring(position));
        $scope.isMention = false;
        bMaxMentionMenu[0].style.display = "none";
    }

    const populateArray = () => {
        var deferred = $q.defer();
        var obj = { content: null };
        $http({
            method: 'GET',
            url: 'https://reqres.in/api/users?page=2'
        }).then(function (response) {
            obj.content = response;
            deferred.resolve(obj.content);
        }, function (error) {

        });

        return deferred.promise;
    }

    $('html').on('click', () => {
        $scope.isMention = false;
        bMaxMentionMenu[0].style.display = "none";
    });
    const getCaretPosition = (textArea, startIndex) => {
        const clone = document.createElement('div')
        const computedStyle = getComputedStyle(textArea)
        for (const prop of computedStyle) {
            clone.style[prop] = computedStyle[prop]
        }
        clone.style.whiteSpace = 'pre-wrap'
        clone.style.wordWrap = 'break-word'
        clone.style.position = 'absolute'
        clone.style.visibility = 'hidden'
        clone.style.overflow = 'hidden'
        clone.textContent = textArea.value.substr(0, textArea.selectionStart)
        const caret = document.createElement('span')
        caret.textContent = '|'
        clone.appendChild(caret)
        document.body.appendChild(clone)
        const { offsetTop, offsetLeft, offsetHeight } = caret
        clone.remove()
        return {
            x: offsetLeft + textArea.offsetLeft - textArea.scrollLeft,
            y: offsetTop + textArea.offsetTop - textArea.scrollTop,
            height: offsetHeight,
        }
    }
});