window.onload = function () {
    window.compensate = true;
    window.Game = {
        "coins": 0,
        "autoClick": 0,
        "perClick": 1,
        "store": {
            "upgradePerClick": 1,
            "upgradeAutoClick": 1,
            "doubleCoins": 15000,
            "changeInterval": 3
        },
        "doubleCoins": false,
        "amtColor": "#0F0",
        "counter": 0,
        "clicks": 0,
        "level": 1,
        "loot_count": 1,
        "last": Date.now(),
        "lastGift": Date.now()
    };
    window.reset = {
        "coins": 0,
        "autoClick": 0,
        "perClick": 1,
        "store": {
            "upgradePerClick": 1,
            "upgradeAutoClick": 1,
            "doubleCoins": 15000,
            "changeInterval": 3
        },
        "doubleCoins": false,
        "amtColor": "#0F0",
        "counter": 0,
        "level": 1,
        "loot_count": 1,
        "clicks": 0,
        "last": Date.now(),
        "lastGift": Date.now()
    };
    window.entries = [];
    window.posX = window.innerWidth;
    window.posY = window.innerHeight;
    var badFate = ["The market crashed!", "Hackers stole a large portion of your coin!", "Uncle Sam taxed your earnings!", "Slow network connection allowed other miners to collect the coin before you did.", "You bought a rare coin,"];
    var badReacts = ["Oh no!!", "Uh oh!", "Oof!", "Yikes!", "Bad news.."];
    var goodFate = ["Tax return time!", "The Market just spiked!", "You sold a rare coin", "Hackers felt bad and gave you back a portion of your coins"];
    var happyReacts = ["Woah!", "Awesome!", "Sweet!!", "It's your lucky day!", "Hard work paid off,"];
    window.viewHTML = function () {
        var html = document.documentElement.outerHTML;
        html = "&lt;!DOCTYPE html>\n\t" + html.replace(/</g, '&lt;');
        document.write("<pre>" + html + "</pre>");
    };

    function processLongNumber(num) {
        if (num.toString()
            .match(/e\+/)) {
            return num.toString();
        }
        num = Math.round(num);
        num = num.toString();
        num = num.split("");
        num = num.reverse();
        var str = "";
        var x = 0;
        for (var i in num) {
            x++;
            if ((x % 3) === 0) {
                str += num[i] + ",";
            } else {
                str += num[i];
            }
        }
        str = str.split("");
        str = str.reverse();
        str = str.join("");
        if (str[0] === ',') {
            str = str.split("");
            str.shift();
            str = str.join("");
            return str;
        } else {
            return str;
        }
    }

    function updateCoins(amt) {
        if (window.Game.doubleCoins === true) {
            if (amt > 0) {
                window.Game.coins += (amt * 2);
                window.Game.counter += (amt *= 2);
            } else {
                window.Game.coins += amt;
            }
        } else if (window.Game.tripleCoins === true) {
            if (amt > 0) {
                window.Game.coins += (amt * 3);
                window.Game.counter += (amt *= 3);
            } else {
                window.Game.coins += amt;
            }
        } else {
            window.Game.coins += amt;
        }
        $("#coins")
            .html(processLongNumber(window.Game.coins) + " coins" + " / <span style='margin: 0;line-height: 10pt;'>" + processLongNumber(window.Game.autoClick) + " per second</span>");
        var element = document.getElementById("coins");
        if (element.offsetHeight < element.scrollHeight || element.offsetWidth < element.scrollWidth) {
            var size = element.style["font-size"];
            size = parseInt(size);
            size -= 1;
            element.style.fontSize = size + "pt";
        } else {}
    }
    window.popup = function (text, title) {
        title = title ? title : "Notification";
        if (text) {
            var exit = $("<div>")
                .addClass("ti-close")
                .addClass("exit")
                .on('mouseup touchend', function (e) {
                    $(this)
                        .parent()
                        .remove();
                });
            var top = $("<h1>")
                .css("font-size", "20pt")
                .html(title);
            var content = $("<pre>")
                .css({
                    "white-space": "pre-wrap",
                    "word-wrap": "break-word",
                    "color": "#FFF"
                })
                .html(text);
            var box = $("<div>")
                .css({
                    "background-color": "#2A2A2A",
                    "width": "calc(80% - 30px)",
                    "height": "calc(80% - 30px)",
                    "padding": "15px",
                    "color": "#3F3",
                    "font-family": "monospace",
                    "position": "fixed",
                    "left": "10vw",
                    "top": "10vh",
                    "box-shadow": "0 0 5px #000"
                })
                .append(exit)
                .append(title)
                .append(content);
            $("body")
                .append(box);
        } else {
            console.warn("Nothing to be notified about");
        }
    };
    window.permission = function (content, callback) {
        callback = callback ? callback : function () {
            return true;
        };
        $("#permission")
            .remove();
        var decline = $("<button>")
            .css({
                "border": "none",
                "outline": "none",
                "color": "#333",
                "background-color": "#3F3",
                "padding": "5px",
                "min-width": "50px",
                "max-width": "75px",
                "margin-left": "5px"
            })
            .text("NO")
            .on('mouseup touchend', function (e) {
                e.preventDefault();
                e.stopPropagation();
                $("#permission")
                    .remove();
            });
        var confirm = $("<button>")
            .css({
                "border": "none",
                "outline": "none",
                "color": "#333",
                "background-color": "#3F3",
                "padding": "5px",
                "min-width": "50px",
                "max-width": "75px",
                "margin-right": "5px"
            })
            .text("YES")
            .on('mouseup touchend', function (e) {
                e.preventDefault();
                e.stopPropagation();
                $("#permission")
                    .remove();
                try {
                    callback();
                } catch (err) {
                    console.error(err);
                }
            });
        var centre = $("<div>")
            .css({
                "text-align": "center",
                "display": "block",
                "margin-top": "15px"
            })
            .append(confirm)
            .append(decline);
        var contentDiv = $("<div>")
            .css({
                "max-width": "50vw",
                "max-height": "50vh",
                "text-align": "center",
                "padding": "15px",
                "background": "#2A2A2A",
                "box-shadow": "0 0 3px #111",
                "color": "#3F3",
                "font-family": "monospace"
            })
            .html(content)
            .append(centre);
        var wrapper = $("<div>")
            .css({
                "width": "100vw",
                "height": "100vh",
                "position": "fixed",
                "left": "0",
                "top": "0",
                "display": "flex",
                "align-items": "center",
                "justify-content": "center"
            })
            .on('mouseup touchend', function () {
                try {
                    window.navigator.vibrate(1000);
                } catch (notSupported) {}
            })
            .attr("id", "permission")
            .append(contentDiv);
        $("body")
            .append(wrapper);
        try {
            window.navigator.vibrate(500);
        } catch (notSupported) {}
    };
    window.alert = function (content, callback) {
        callback = callback ? callback : function () {
            return true;
        };
        $("#alert")
            .remove();
        var close = $("<button>")
            .css({
                "border": "none",
                "outline": "none",
                "color": "#333",
                "background-color": "#3F3",
                "padding": "5px",
                "width": "50px"
            })
            .text("OK")
            .on('mouseup touchend', function (e) {
                e.preventDefault();
                $("#alert")
                    .remove();
                try {
                    callback();
                } catch (err) {
                    console.error(err);
                }
            });
        var centre = $("<div>")
            .css({
                "text-align": "center",
                "display": "block",
                "margin-top": "15px"
            })
            .append(close);
        var contentDiv = $("<div>")
            .css({
                "max-width": "50vw",
                "max-height": "50vh",
                "text-align": "center",
                "padding": "15px",
                "background": "#2A2A2A",
                "box-shadow": "0 0 3px #111",
                "color": "#3F3",
                "font-family": "monospace"
            })
            .html(content)
            .append(centre);
        var wrapper = $("<div>")
            .css({
                "width": "100vw",
                "height": "100vh",
                "position": "fixed",
                "left": "0",
                "top": "0",
                "display": "flex",
                "align-items": "center",
                "justify-content": "center"
            })
            .on('mouseup touchend', function () {
                try {
                    window.navigator.vibrate(1000);
                } catch (notSupported) {}
            })
            .attr("id", "alert")
            .append(contentDiv);
        $("body")
            .append(wrapper);
        try {
            window.navigator.vibrate(500);
        } catch (notSupported) {}
    };
    window.lootBox = function () {
        var possibilities = [function () {
            coin = Math.floor(Math.random() * 5) + 1;
            var percentage = coin + "00%";
            updateCoins((window.Game.coins * coin));
            if (percentage == "100%") {
                alert("<div style='font-size: 15pt;text-align: center;margin: 15px;' class='ti-gift'></div>You doubled your coins!");
            } else {
                alert("<div style='font-size: 15pt;text-align: center;margin: 15px;' class='ti-gift'></div>You got a bonus " + percentage + " of your current coins added.");
            }
        }, function () {
            window.Game.perClick *= 2;
            window.Game.store.upgradePerClick *= 2;
            alert("<div style='font-size: 15pt;text-align: center;margin: 15px;' class='ti-gift'></div>Your 'Per Click' value is now worth twice as much");
        }, function () {
            window.Game.autoClick *= 2;
            window.Game.store.upgradeAutoClick *= 2;
            alert("<div style='font-size: 15pt;text-align: center;margin: 15px;' class='ti-gift'></div>Your Auto Clicking earnings are now worth twice as much!");
        }, function () {
            alert("<div style='font-size: 15pt;text-align: center;margin: 15px;' class='ti-gift'></div>You get 60s of Double Coins!!", window.doubleCoins(60));
        }, function () {
            var clicks = [50, 100, 250, 500];
            var clickHyperChoice = clicks[Math.floor(Math.random() * clicks.length)];
            alert("<div style='font-size: 15pt;text-align: center;margin: 15px;' class='ti-gift'></div>You got " + clickHyperChoice + " Hyper Clicks!!");
            var i = 0;
            var hyper;
            hyper = setInterval(function () {
                if (i >= clickHyperChoice) {
                    clearInterval(hyper);
                } else {
                    i++$("#content, #console_area")
                        .trigger({
                            type: "mousedown",
                            pageX: window.innerWidth / 2,
                            pageY: window.innerHeight / 2
                        });
                }
            }, 80);
        }, function () {
            alert("<div style='font-size: 15pt;text-align: center;margin: 15px;' class='ti-gift'></div>You got 30s of Triple Coins.", window.tripleCoins);
        }];
        possibilities[Math.floor(Math.random() * possibilities.length)]();
    };
    window.fate = function () {
        var goodOrBad = Math.floor(Math.random() * 3);
        if (goodOrBad === 0) {
            var percentString = percentage + "0%";
            percentage = percentage * 0.1;
            alert("<div class='ti-face-sad' style='font-size: 15pt;margin: 15px;'></div><div>" + badReacts[Math.floor(Math.random() * badReacts.length)] + " " + badFate[Math.floor(Math.random() * badFate.length)] + "! You lost " + percentString + " of your coins!</div>");
            var amt = $("<div>")
                .text(Math.round(-1 * (window.Game.coins * percentage)))
                .css({
                    "position": "fixed",
                    "left": window.posX + "px",
                    "top": window.posY + "px",
                    "color": "#F00",
                    "text-shadow": "0 0 5px #F00",
                    "font-size": "13pt",
                    "font-family": "monospace",
                    "pointer-events": "none"
                })
                .animate({
                    "left": "15px",
                    "top": "15px",
                    "opacity": "0.3"
                }, 3000, "linear", function () {
                    $(this)
                        .remove();
                    updateCoins((-1 * Math.round(window.Game.coins * percentage)));
                });
            $("body")
                .append(amt);
        } else if (goodOrBad === 1) {
            var perc = Math.floor(Math.random() * 9) + 1;
            if (perc >= 8) {
                window.Game.loot_count = 1;
            } else {}
            var strPerc = perc + "0%";
            perc = perc * 0.1;
            alert("<div class='ti-face-sad' style='font-size: 15pt;margin: 15px;'></div>" + badReacts[Math.floor(Math.random() * badReacts.length)] + " your click values have been reduced by " + strPerc);
            window.Game.store.upgradePerClick = window.Game.store.upgradePerClick - (window.Game.store.upgradePerClick * perc);
            window.Game.store.upgradeAutoClick = window.Game.store.upgradeAutoClick - (window.Game.store.upgradeAutoClick * perc);
            window.Game.perClick = window.Game.perClick - (window.Game.perClick * perc);
            window.Game.autoClick = window.Game.autoClick - (window.Game.autoClick * perc);
            if (window.Game.perClick < 1 || window.Game.store.upgradePerClick < 1) {
                window.Game.perClick = 1;
                window.Game.store.upgradePerClick = 1;
            } else {}
            if (window.Game.autoClick < 1 || window.Game.store.upgradeAutoClick < 1) {
                window.Game.autoClick = 1;
                window.Game.store.upgradeAutoClick = 1;
            } else {}
        } else {
            var percentString = percentage + "0%";
            percentage = percentage * 0.1;
            alert("<div class='ti-face-smile' style='font-size: 15pt;margin: 15px;'></div><div>" + happyReacts[Math.floor(Math.random() * happyReacts.length)] + " " + goodFate[Math.floor(Math.random() * goodFate.length)] + "! You gained a bonus " + percentString + " of your coins!</div>");
            var amt = $("<div>")
                .text("+" + Math.round(window.Game.coins * percentage))
                .css({
                    "position": "fixed",
                    "left": window.posX + "px",
                    "top": window.posY + "px",
                    "color": "#0F0",
                    "text-shadow": "0 0 5px #7F7",
                    "font-size": "13pt",
                    "font-family": "monospace",
                    "pointer-events": "none"
                })
                .animate({
                    "left": "15px",
                    "top": "15px",
                    "opacity": "0.3"
                }, 3000, "linear", function () {
                    $(this)
                        .remove();
                    updateCoins(Math.round(window.Game.coins * percentage));
                });
            $("body")
                .append(amt);
        }
        setTimeout(function () {
            window.fate();
        }, ((Math.random() * 2) + 1) * 60000);
    };
    window.notify = window.popup;
    if (localStorage && localStorage.Game) {
        window.Game = JSON.parse(localStorage.Game);
        window.Game.doubleCoins = false;
        window.Game.tripleCoins = false;
        window.Game.amtColor = "#0F0";
        var timeBetween = Math.round((Date.now() - window.Game.last) / 1000);
        var hours = Math.floor(timeBetween / 3600);
        var minutes = Math.floor((timeBetween - (hours * 3600)) / 60);
        var seconds = timeBetween - (hours * 3600) - (minutes * 60);
        seconds = Math.round(seconds * 100) / 100;
        var cashEarned = timeBetween * window.Game.autoClick;
        window.notify("You were gone " + hours + " hrs " + minutes + " mins " + seconds + " seconds. You earned <span style='color: #3F3;'>" + processLongNumber(cashEarned) + "</span> coins.", "Welcome Back!");
        updateCoins(cashEarned);
    } else {
        window.notify("I see that you have never played this game before, or at least don't have a save available, leading me to believe this is your first time here. If you need help with playing the game there are instructions in the information center. Have fun! <br />- Brandon P<br /><br /><br /><small>Your progress autosaves on most browsers.</small>", "Welcome to Hackr Clickr!");
    }
    window.doubleCoins = function (len) {
        len = len ? len : 30;
        window.Game.tripleCoins = false;
        window.Game.doubleCoins = true;
        window.Game.counter = 0;
        $("#buffs")
            .html("<span style='color: gold; text-shadow: 0 0 2px orange;'>Double Coins! :30</span>");
        window.Game.amtColor = 'gold';
        var loop;
        var i = len;
        len *= 1000;
        loop = setInterval(function () {
            --i;
            $("#buffs")
                .html("<span style='color: gold; text-shadow: 0 0 2px orange;'>Double Coins! :" + i + "</span>");
        }, 1000);
        setTimeout(function () {
            window.Game.doubleCoins = false;
            $("#buffs")
                .html("");
            window.Game.amtColor = '#0F0';
            clearInterval(loop);
            alert("<div style='color: gold;text-align: center;font-size: 15pt;'>Double Coin Results</div>You mined " + processLongNumber(window.Game.counter) + " coins!");
        }, len);
    };
    window.tripleCoins = function (len) {
        len = len ? len : 30;
        window.Game.doubleCoins = false;
        window.Game.tripleCoins = true;
        window.Game.counter = 0;
        $("#buffs")
            .html("<span style='color: #A0AABF; text-shadow: 0 0 2px #697998;'>Triple Coins! :30</span>");
        window.Game.amtColor = '#A0AABF';
        var loop;
        var i = len;
        len *= 1000;
        loop = setInterval(function () {
            --i;
            $("#buffs")
                .html("<span style='color: #A0AABF; text-shadow: 0 0 2px #697998;'>Triple Coins! :" + i + "</span>");
        }, 1000);
        setTimeout(function () {
            window.Game.tripleCoins = false;
            $("#buffs")
                .html("");
            window.Game.amtColor = '#0F0';
            clearInterval(loop);
            alert("<div style='color: #A0AABF;text-align: center;font-size: 15pt;'>Triple Coin Results</div>You mined " + processLongNumber(window.Game.counter) + " coins!");
        }, len);
    };
    var matrixEntries = ["Connecting to Client...\nConnected.", "Resolving Host (0.0.0.0)", " Loading Metaploit...", "\t\t:ACCESS GRANTED", "$(127.0.0.1).launch(function(){\n\t$(" + location.host + ").execute(virus)\n});", "Server Report:\n\tServer IP: 192.168.0.1\n\tServer NetMask: 255.255.255.0\n\t0 flags up\n\tServer Gateway: 192.168.0.0\n\tServer DNS 1: 1.1.1.1\n\tServer DNS 2: 2.2.2.2", "\t\t::ACCESS DENIED", "\n", "\nLogin\n Username: SecondToKVCTBF\n Password: *********4kV", "Reallocating Memory...", " - Loading Database Pentesting Kit (DPK v5)\n\tLoaded Data (100%)\n\tUnpacking Data (47%)", "\n -- Binding device to port 443 (HTTPS) of 192.168.0.12\n\t-- Reformatting Drive......", JSON.stringify(window.Game, null, ' ')];
    setInterval(function () {
        updateCoins(window.Game.autoClick);
    }, 1000);
    $("#content")
        .on("mousedown touchstart", function (e) {
            e.preventDefault();
            if (e.touches && e.touches.length > 1 && window.innerHeight > window.innerWidth) {} else {
                if (window.Game.clicks > 0 && window.Game.clicks <= 100) {
                    window.Game.level = 2;
                } else if (window.Game.clicks > 100 && window.Game.clicks <= 250) {
                    window.Game.level = 3;
                } else if (window.Game.clicks > 250 && window.Game.clicks <= 500) {
                    window.Game.level = 4;
                } else if (window.Game.clicks > 500 && window.Game.clicks <= 1000) {
                    window.Game.level = 5;
                } else if (window.Game.clicks > 1000 && window.Game.clicks <= 2500) {
                    window.Game.level = 6;
                } else if (window.Game.clicks > 2500 && window.Game.clicks <= 5000) {
                    window.Game.level = 7;
                } else if (window.Game.clicks > 5000 && window.Game.clicks <= 10000) {
                    window.Game.level = 8;
                } else if (window.Game.clicks > 10000 && window.Game.clicks <= 15000) {
                    window.Game.level = 9;
                } else if (window.Game.clicks > 15000 && window.Game.clicks <= 20000) {
                    window.Game.level = 8;
                } else if (window.Game.clicks > 20000 && window.Game.clicks <= 25000) {
                    window.Game.level = 9;
                } else if (window.Game.clicks > 25000 && window.Game.clicks <= 50000) {
                    window.Game.level = 10;
                } else if (window.Game.clicks > 50000 && window.Game.clicks <= 75000) {
                    window.Game.level = 11;
                } else if (window.Game.clicks > 100000 && window.Game.clicks <= 125000) {
                    window.Game.level = 12;
                } else if (window.Game.clicks > 125000 && window.Game.clicks <= 150000) {
                    window.Game.level = 13;
                } else if (window.Game.clicks > 150000 && window.Game.clicks <= 175000) {
                    window.Game.level = 14;
                } else if (window.Game.clicks > 175000 && window.Game.clicks <= 200000) {
                    window.Game.level = 15;
                } else if (window.Game.clicks > 200000 && window.Game.clicks <= 250000) {
                    window.Game.level = 16;
                } else if (window.Game.clicks > 250000 && window.Game.clicks <= 300000) {
                    window.Game.level = 17;
                } else if (window.Game.clicks > 300000 && window.Game.clicks <= 350000) {
                    window.Game.level = 18;
                } else if (window.Game.clicks > 350000 && window.Game.clicks <= 400000) {
                    window.Game.level = 19;
                } else if (window.Game.clicks > 400000 && window.Game.clicks <= 500000) {
                    window.Game.level = 20;
                } else {}
                $("#level")
                    .text(window.Game.level);
                window.Game.clicks += 1;
                try {
                    e.clientX = e.changedTouches[0].clientX;
                    e.clientY = e.changedTouches[0].clientY;
                } catch (notMobile) {}
                window.entries.push(matrixEntries[Math.floor(Math.random() * matrixEntries.length)]);
                if (window.entries.length >= 10) {
                    window.entries.shift();
                } else {}
                var contents = window.entries.reverse();
                contents = window.entries.join("\n");
                $("#console_area")
                    .html(contents);
                var coins;
                if (window.Game.doubleCoins === true) {
                    coins = window.Game.perClick * 2;
                } else if (window.Game.tripleCoins === true) {
                    coins = window.Game.perClick * 3;
                } else {
                    coins = window.Game.perClick;
                }
                var amt = $("<div>")
                    .text("+" + processLongNumber(coins))
                    .css({
                        "position": "fixed",
                        "left": (e.clientX || e.pageX) + "px",
                        "top": (e.clientY || e.pageY) + "px",
                        "color": window.Game.amtColor ? window.Game.amtColor : '#0F0',
                        "font-size": "10pt",
                        "font-family": "monospace",
                        "pointer-events": "none"
                    })
                    .animate({
                        "left": "15px",
                        "top": "15px",
                        "opacity": "0.3"
                    }, 1750, "linear", function () {
                        $(this)
                            .remove();
                        updateCoins(window.Game.perClick);
                    });
                $("body")
                    .append(amt);
            }
        });
    $("#menu_btns td")
        .on("mouseup touchend", function (e) {
            e.stopPropagation();
            $("#shopMenu, #settingsMenu, #infoMenu")
                .hide();
            $("#menu_holder")
                .fadeOut(0);
            which = $(this)
                .attr("id");
            $("#menu_holder")
                .show();
            $("#" + which + "Menu")
                .show();
            if (which === "shop") {
                $("#shopContent")
                    .html("");
                var loading = $("<div>")
                    .text("Loading Shop")
                    .css({
                        "height": "50vh",
                        "width": "100%",
                        "display": "flex",
                        "align-items": "center",
                        "justify-content": "center"
                    })
                    .attr("id", "loadingShop");
                $("#shopContent")
                    .append(loading);
                var upgradePerClickPrice = Math.round((window.Game.store.upgradePerClick / 0.25) * 50);
                var upgradeAutoClickPrice = Math.round((window.Game.store.upgradeAutoClick / 0.05) * 125);
                var doubleCoinsPrice = window.Game.store.doubleCoins;
                var upgradePerClickBtn = $("<button>")
                    .css({
                        "color": "#333",
                        "background-color": "#3F3",
                        "padding": "5px",
                        "border": "none",
                        "outline": "none",
                        "font-family": "monospace",
                        "float": "right",
                        "max-width": "100%",
                        "overflow": "hidden"
                    })
                    .text("Costs " + processLongNumber(upgradePerClickPrice))
                    .on('mouseup touchend', function (e) {
                        e.preventDefault();
                        if (window.Game.coins >= upgradePerClickPrice) {
                            window.Game.store.upgradePerClick *= 3;
                            updateCoins(-1 * upgradePerClickPrice);
                            window.Game.perClick = window.Game.store.upgradePerClick;
                            upgradePerClickPrice = Math.round((window.Game.store.upgradePerClick / 0.25) * 50);
                            $(this)
                                .text("Costs " + processLongNumber(upgradePerClickPrice));
                            $(this)
                                .css("background-color", "#3F3");
                        } else {
                            $(this)
                                .css("background-color", "#F33");
                        }
                    });
                var doubleOrNothingBtn = $("<button>")
                    .css({
                        "color": "#333",
                        "background-color": "#3F3",
                        "padding": "5px",
                        "border": "none",
                        "outline": "none",
                        "font-family": "monospace",
                        "float": "right",
                        "max-width": "100%",
                        "overflow": "hidden"
                    })
                    .text("FREE")
                    .on('mouseup touchend', function (e) {
                        e.preventDefault();
                        permission("Double or Nothing means you have a 50/50 chance or either losing everything (coins and click value) or doubling the value of everything (coins and click value)\n\nAre you sure you want to proceed?<br />Note: I would only try it if I was feeling lucky.",
                            function () {
                                alert("3");
                                setTimeout(function () {
                                    alert("2");
                                    setTimeout(function () {
                                        alert("1");
                                        var random = Math.floor(Math.random() * 2);
                                        if (random === 0) {
                                            var amt = $("<div>")
                                                .text(-1 * window.Game.coins)
                                                .css({
                                                    "position": "fixed",
                                                    "left": window.posX + "px",
                                                    "top": window.posY + "px",
                                                    "color": "#F00",
                                                    "text-shadow": "0 0 5px #F00",
                                                    "font-size": "13pt",
                                                    "font-family": "monospace",
                                                    "pointer-events": "none"
                                                })
                                                .animate({
                                                    "left": "15px",
                                                    "top": "15px",
                                                    "opacity": "0.3"
                                                }, 3000, "linear", function () {
                                                    $(this)
                                                        .remove();
                                                    alert("<div style='font-size: 15pt;text-align: center;margin: 15px;' class='ti-package'></div>You lost everything");
                                                });
                                            $("body")
                                                .append(amt);
                                            window.Game = window.reset;
                                        } else {
                                            window.Game.perClick *= 2;
                                            window.Game.autoClick *= 2;
                                            window.Game.store.upgradeAutoClick *= 2;
                                            window.Game.store.upgradePerClick *= 2;
                                            updateCoins(window.Game.coins);
                                            alert("<div style='font-size: 15pt;text-align: center;margin: 15px;' class='ti-package'></div>You doubled everything");
                                        }
                                        window.Game.last = Date.now();
                                        localStorage.Game = JSON.stringify(window.Game);
                                    }, 2000);
                                }, 1000);
                            });
                    });
                var upgradeAutoClickBtn = $("<button>")
                    .css({
                        "color": "#333",
                        "background-color": "#3F3",
                        "padding": "5px",
                        "border": "none",
                        "outline": "none",
                        "font-family": "monospace",
                        "float": "right",
                        "max-width": "100%",
                        "overflow": "hidden"
                    })
                    .text("Costs " + processLongNumber(upgradeAutoClickPrice))
                    .on('mouseup touchend', function (e) {
                        e.preventDefault();
                        if (window.Game.coins >= upgradeAutoClickPrice) {
                            window.Game.store.upgradeAutoClick *= 3;
                            updateCoins(-1 * upgradeAutoClickPrice);
                            window.Game.autoClick = window.Game.store.upgradeAutoClick;
                            upgradeAutoClickPrice = Math.round((window.Game.store.upgradeAutoClick / 0.05) * 125);
                            $(this)
                                .text("Costs " + processLongNumber(upgradeAutoClickPrice));
                            $(this)
                                .css("background-color", "#3F3");
                        } else {
                            $(this)
                                .css("background-color", "#F33");
                        }
                    });
                var getNewFate = $("<button>")
                    .css({
                        "color": "#333",
                        "background-color": "#3F3",
                        "padding": "5px",
                        "border": "none",
                        "outline": "none",
                        "font-family": "monospace",
                        "float": "right",
                        "max-width": "100%",
                        "overflow": "hidden"
                    })
                    .text("Costs " + processLongNumber(Math.pow(100, window.Game.loot_count) / 2))
                    .on('mouseup touchend', function (e) {
                        e.preventDefault();
                        if (window.Game.coins > (Math.pow(100, window.Game.loot_count) / 2)) {
                            updateCoins(-1 * (Math.pow(100, window.Game.loot_count) / 2));
                            window.lootBox();
                            window.Game.loot_count += 1;
                            $(this)
                                .text("Costs " + processLongNumber(Math.pow(100, window.Game.loot_count) / 2));
                            $(this)
                                .css("background-color", "#3F3");
                        } else {
                            $(this)
                                .css("background-color", "#F33");
                        }
                    });
                var getDoubleCoins = $("<button>")
                    .css({
                        "color": "#333",
                        "background-color": "gold",
                        "padding": "5px",
                        "border": "none",
                        "outline": "none",
                        "font-family": "monospace",
                        "float": "right",
                        "max-width": "100%",
                        "overflow": "hidden"
                    })
                    .text("Costs " + processLongNumber(doubleCoinsPrice))
                    .on('mouseup touchend', function (e) {
                        e.preventDefault();
                        if (window.Game.coins >= doubleCoinsPrice) {
                            window.Game.store.doubleCoins = Math.round(Math.pow(window.Game.store.doubleCoins, 1.25));
                            updateCoins(-1 * doubleCoinsPrice);
                            doubleCoins();
                            doubleCoinsPrice = window.Game.store.doubleCoins;
                            $(this)
                                .text("Costs " + processLongNumber(doubleCoinsPrice));
                            $(this)
                                .css("background-color", "#3F3");
                        } else {
                            $(this)
                                .css("background-color", "#F33");
                        }
                    });
                var perClickWrapper = $("<td>")
                    .append(upgradePerClickBtn);
                var upgradePerClick = $("<tr>")
                    .append("<td>Upgrade Per Click Income</td>")
                    .append(perClickWrapper);
                var autoWrapper = $("<td>")
                    .append(upgradeAutoClickBtn);
                var upgradeAuto = $("<tr>")
                    .append("<td>Upgrade Auto Click Income (Clicks once per second)</td>")
                    .append(autoWrapper);
                var dblCoinsWrapper = $("<td>")
                    .append(getDoubleCoins);
                var dblCoins = $("<tr>")
                    .append("<td><span style='color: gold;'>Double all Coins for 30s</span></td>")
                    .append(dblCoinsWrapper);
                var fateWrapper = $("<td>")
                    .append(getNewFate);
                var fateTr = $("<tr>")
                    .append("<td>Loot Box</td>")
                    .append(fateWrapper);
                var dblWrapper = $("<td>")
                    .append(doubleOrNothingBtn);
                var dblTr = $("<tr>")
                    .append("<td>Double or Nothing</td>")
                    .append(dblWrapper);
                var pricingTable = $("<table>")
                    .css({
                        "table-layout": "fixed",
                        "width": "100%"
                    })
                    .append(upgradeAuto)
                    .append(upgradePerClick)
                    .append(fateTr)
                    .append(dblTr)
                    .append(dblCoins);
                $("#shopContent")
                    .html("")
                    .append(pricingTable);
            } else {}
        });
    $("#exit")
        .on("mouseup touchend", function (e) {
            e.preventDefault();
            $("#shopMenu, #settingsMenu, #infoMenu")
                .hide();
            $("#menu_holder")
                .fadeOut(100);
        });
    $("#reset")
        .on("mouseup touchend", function (e) {
            e.preventDefault();
            e.stopPropagation();
            permission("This will reset all your progress. Are you sure you want to continue? This can not be undone.", function () {
                window.Game = window.reset;
                delete localStorage.Game;
            })
        });
    window.idle = 0;
    setInterval(function () {
        window.idle += 1;
        var hours = Math.floor(window.idle / 3600);
        var minutes = Math.floor((window.idle - (hours * 3600)) / 60);
        var seconds = window.idle - (hours * 3600) - (minutes * 60);
        seconds = Math.round(seconds * 100) / 100;
        $("#playTime")
            .text(hours + " hrs " + minutes + " mins " + seconds + " seconds");
        $("#clicks")
            .text(window.Game.clicks);
    }, 1000);
    $("#quickSave")
        .on("mouseup touchend", function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (!localStorage) {
                notify("We couldn't save your game, It seems your browser is blocking access from saving your game.", "Save failed.")
            } else {
                window.Game.last = Date.now();
                localStorage.Game = JSON.stringify(window.Game);
            }
        });
    $("#reduceLag")
        .on("mouseup touchend", function (e) {
            e.preventDefault();
            e.stopPropagation();
            $("#console_area")
                .html("Keep tapping!!");
        });
    window.onbeforeunload = function (e) {
        window.Game.last = Date.now();
        localStorage.Game = JSON.stringify(window.Game);
        return null;
    };
    $(document)
        .on("mousemove", function (e) {
            window.posX = e.clientX || e.pageX;
            window.posY = e.clientY || e.pageY;
            if (window.innerHeight < window.innerWidth) {
                $("#mouse")
                    .css({
                        "position": "absolute",
                        "left": (e.clientX || e.pageX) + "px",
                        "top": (e.clientY || e.pageY) + "px"
                    });
            } else {}
        });
    $("#update")
        .on("mousedown touchstart", function () {
            location.reload();
        });
    setTimeout(function () {
        window.Game.last = Date.now();
        localStorage.Game = JSON.stringify(window.Game);
    }, 120000);
    if (window.compensate === true) {
        if (window.Game.lastGift && (Date.now() - window.Game.lastGift >= 3600000)) {
            alert("For being a beta tester, we have paid you 1,000 coins for logging on.<br /><span style='color: #FFF;'>Press OK to receive a FREE Loot Box.</span>", lootBox);
            var amt = $("<div>")
                .text("+1000")
                .css({
                    "position": "fixed",
                    "left": window.posX + "px",
                    "top": window.posY + "px",
                    "color": "#0F0",
                    "text-shadow": "0 0 5px #7F7",
                    "font-size": "13pt",
                    "font-family": "monospace",
                    "pointer-events": "none"
                })
                .animate({
                    "left": "15px",
                    "top": "15px",
                    "opacity": "0.3"
                }, 3000, "linear", function () {
                    $(this)
                        .remove();
                    updateCoins(1000);
                    window.Game.lastGift = Date.now();
                });
            $("body")
                .append(amt);
        } else if (!window.Game.lastGift) {
            alert("For being a beta tester, we have paid you 1,000 coins for logging on.<br /><span style='color: #FFF;'>Press OK to receive a FREE Loot Box.</span>", lootBox);
            var amt = $("<div>")
                .text("+1000")
                .css({
                    "position": "fixed",
                    "left": window.posX + "px",
                    "top": window.posY + "px",
                    "color": "#0F0",
                    "text-shadow": "0 0 5px #7F7",
                    "font-size": "13pt",
                    "font-family": "monospace",
                    "pointer-events": "none"
                })
                .animate({
                    "left": "15px",
                    "top": "15px",
                    "opacity": "0.3"
                }, 3000, "linear", function () {
                    $(this)
                        .remove();
                    updateCoins(1000);
                    window.Game.lastGift = Date.now();
                });
            $("body")
                .append(amt);
        } else {
            alert("For being a beta tester, we have paid you 1,000 coins for logging on.");
            var amt = $("<div>")
                .text("+1000")
                .css({
                    "position": "fixed",
                    "left": window.posX + "px",
                    "top": window.posY + "px",
                    "color": "#0F0",
                    "text-shadow": "0 0 5px #7F7",
                    "font-size": "13pt",
                    "font-family": "monospace",
                    "pointer-events": "none"
                })
                .animate({
                    "left": "15px",
                    "top": "15px",
                    "opacity": "0.3"
                }, 3000, "linear", function () {
                    $(this)
                        .remove();
                    updateCoins(1000);
                });
            $("body")
                .append(amt);
        }
    } else {}
    if (localStorage.Game) {
        setTimeout(window.fate, 10000);
    } else {
        setTimeout(function () {
            window.fate();
        }, ((Math.random() * 2) + 1) * 60000);
    }
    $("#content, #console_area")
        .on("contextmenu", function (e) {
            e.preventDefault();
        });
};
