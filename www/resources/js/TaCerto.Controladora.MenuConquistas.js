var TaCerto = TaCerto || {};
TaCerto.Controladora = TaCerto.Controladora || {};
TaCerto.Controladora.MenuConquistas = {
	model:{
		timeOutSnackBar: undefined,
		idGlobal: 0
	},
	load: function(){
		TaCerto.Controladora.CarregarPagina.htmlCorpo("menuConquistas",["dica"],["dica"]);
		this.loadAchievements();

		function calculaLvl(xp){
			var levelImg = document.getElementById('nivelImage').firstElementChild;
			var level = 1;
			xp-=200;
			while(xp !== 0)
				xp -= xp > 0 ? ++level * 100 : level-- * 0 + xp;

			console.log("Meu level = "+level);
			level++;
			if(level <= 1){
				console.log("IMAGEM 1");
				levelImg.src= "resources/media/image/1.png"; 
			}else{
				console.log("IMAGEM "+level);
				levelImg.src='resources/media/image/'+level+'.png'; 
			}
				
			return level;
		}

		function moveXPBar(nivel, maxNivel, nextLevelXp){
			var xpTotal = document.getElementById('xpTotal');
			var xpNextLevel =document.getElementById('xpNextLevel');
			if (nivel < maxNivel) {
				var xpBar = document.getElementsByClassName('back_xpBar')[0];
				if(xpBar){
					document.getElementById('xpNextLevel').innerHTML = nextLevelXp;
					xpBar.classList.remove("transition00", "transition03");
					xpBar.classList.add("transition00");
					xpBar.style.width = "0";
					setTimeout(function(){
						xpBar.classList.remove("transition00", "transition03");
						xpBar.classList.add("transition03");
						xpBar.style.width = "100%";
						nextLevelXp += (++nivel + 1)* 100;
						setTimeout(function(){
							moveXPBar(nivel, maxNivel, nextLevelXp);
						}, 320);
					}, 10);
				}
			}
			else{
				var xpBar = document.getElementsByClassName('back_xpBar')[0];
				if(xpBar){
					var deltaXp = parseInt(document.getElementById('xpNextLevel').innerHTML);
					deltaXp = ((TaCerto.Estrutura.Jogador.xp - deltaXp)/(nextLevelXp - deltaXp))*100;
					document.getElementById('xpNextLevel').innerHTML = nextLevelXp;
					xpBar.classList.remove("transition00", "transition03");
					xpBar.classList.add("transition00");
					xpBar.style.width = "0";
					setTimeout(function(){
						xpBar.classList.remove("transition00", "transition03");
						xpBar.classList.add("transition03");
						xpBar.style.width = deltaXp === 0 ? 0 : deltaXp > 10 ? deltaXp + "%" : "10%";
					}, 10);
				}
				var intervalo = setInterval(function(){
					var next = document.getElementById('xpTotal');
					if (next){
						if(parseInt(next.innerHTML) < TaCerto.Estrutura.Jogador.xp)
							next.innerHTML = (parseInt(next.innerHTML) + 100);
						else{
							clearInterval(intervalo);
							next.innerHTML = TaCerto.Estrutura.Jogador.xp;
						}
					}
				}, 100);
			}
		} moveXPBar(0, calculaLvl(TaCerto.Estrutura.Jogador.xp), 200);
	},
	callGame: function(tipo, el){
		TaCerto.GenFunc.fadeInBtnClick(el,
		function(){
			TaCerto.Controladora.Jogo.Load(tipo);
		});
	},
	homeBtn: function (el) {
		TaCerto.GenFunc.fadeInBtnClick(el,
		function(){
			TaCerto.Controladora.MenuInicial.load();
		});
	},
	loadAchievements: function (){
		var numAchiev = TaCerto.Estrutura.Conquistas.lengthConquista();
		var achievs = TaCerto.Estrutura.Conquistas.conquistas;
		
		var tabelaConquistas = document.getElementById('telaConquista');

		// Apaga todos os filhos
		while(tabelaConquistas.firstChild)
			tabelaConquistas.removeChild(tabelaConquistas.firstChild);

		// Add as conquistas
		for(var i = 0; i < numAchiev; i++){
			let currentAchiev = achievs[i];
			let bg = "";
			let x = false;
			
			if(i%2===0){
				bg = "telaConquistaLiZero";
			}else{
				bg = "telaConquistaLiVinte";
			}
			
			if(TaCerto.Estrutura.Jogador.conquistas[i]){
				// Jogador já completou a conquista
				tabelaConquistas.innerHTML += '<li class="collection-item avatar green '+bg+'"><img class="imgConquista" src="resources/media/image/'+currentAchiev[3]+'.jpg" alt=""><div class="textMidConquista"><h4 class="title left-align">'+currentAchiev[0]+'</h4><h6 class="left-align h7">'+currentAchiev[1]+'</h6></div><div class="trofeuConquista"><img src="resources/media/image/'+currentAchiev[4]+'.png" alt="ilustracao trofeu"></div></li>';
			}else{
				// Jogador ainda não completou a conquista
				tabelaConquistas.innerHTML += '<li class="collection-item avatar '+bg+'"><img class="imgConquista" src="resources/media/image/'+currentAchiev[3]+'.jpg" alt=""><div class="textMidConquista"><h4 class="title left-align">'+currentAchiev[0]+'</h4><h6 class="left-align h7">'+currentAchiev[1]+'</h6></div><div class="trofeuConquista"><img src="resources/media/image/'+currentAchiev[4]+'.png" alt="ilustracao trofeu"></div></li>';
				x = true;
			}
			
		}
		
		var imgConquista = document.getElementsByClassName('imgConquista');
		var imgTrofeu = document.getElementsByClassName('trofeuConquista');

		for(var i = 0; i < numAchiev; i++){
			if(!TaCerto.Estrutura.Jogador.conquistas[i]){
				imgConquista[i].classList.add('conquistaNaoConquistada');
				imgTrofeu[i].classList.add('conquistaNaoConquistada');
			}
		}
	},
	checkAchievements: function(){
		var acertoTotal = TaCerto.Estrutura.Jogador.totalAcertos;
		var estrelasTotal = 0;
		var moneyTotal = TaCerto.Estrutura.Jogador.moeda;
		var conquistas = TaCerto.Estrutura.Jogador.conquistas;
		let totalDeCartasUsadas = TaCerto.Estrutura.Jogador.cartaVermelhaUsadas + TaCerto.Estrutura.Jogador.cartaAzulUsadas + TaCerto.Estrutura.Jogador.cartaAmarelaUsadas + TaCerto.Estrutura.Jogador.cartaVerdeUsadas;

		for(var i = 0; i < 9; ++i){
			if(TaCerto.Estrutura.Jogador.missoes[i][0] && TaCerto.Estrutura.Jogador.missoes[i][1] && TaCerto.Estrutura.Jogador.missoes[i][2])
				++estrelasTotal;
		}

		if(!conquistas[0]){ // Checa a conquista 0
			if(estrelasTotal >= 1){
				this.showAchievementPanel(0);				
				// Atualiza conquista obtida
				conquistas[0] = true;
				// Entrega prêmio
				//TaCerto.Estrutura.Jogador.moeda += TaCerto.Estrutura.Conquistas.conquistas[0][2];
			}
		} 
		
		if(!conquistas[1]){ // Checa a conquista 1
			if(estrelasTotal >= 3){
				this.showAchievementPanel(1);				
				// Atualiza conquista obtida
				conquistas[1] = true;
				// Entrega prêmio
				//TaCerto.Estrutura.Jogador.moeda += TaCerto.Estrutura.Conquistas.conquistas[1][2];
			}
		}
		
		if(!conquistas[2]){ // Checa a conquista 2
			if(estrelasTotal >= 5){
				this.showAchievementPanel(2);				
				// Atualiza conquista obtida
				conquistas[2] = true;
				// Entrega prêmio
				//TaCerto.Estrutura.Jogador.moeda += TaCerto.Estrutura.Conquistas.conquistas[2][2];
			}
		}
		
		if(!conquistas[3]){ // Checa a conquista 3
			if(acertoTotal >= 10){
				this.showAchievementPanel(3);				
				// Atualiza conquista obtida
				conquistas[3] = true;
				// Entrega prêmio
				//TaCerto.Estrutura.Jogador.moeda += TaCerto.Estrutura.Conquistas.conquistas[3][2];
			}
		}
		
		if(!conquistas[4]){ // Checa a conquista 4
			if(acertoTotal >= 50){
				this.showAchievementPanel(4);				
				// Atualiza conquista obtida
				conquistas[4] = true;
				// Entrega prêmio
				//TaCerto.Estrutura.Jogador.moeda += TaCerto.Estrutura.Conquistas.conquistas[4][2];
			}
		}
		
		if(!conquistas[5]){ // Checa a conquista 5
			if(acertoTotal >= 100){
				this.showAchievementPanel(5);				
				// Atualiza conquista obtida
				conquistas[5] = true;
				// Entrega prêmio
				//TaCerto.Estrutura.Jogador.moeda += TaCerto.Estrutura.Conquistas.conquistas[5][2];
			}
		}
		
		if(!conquistas[6]){ // Checa a conquista 6
			if(moneyTotal >= 25){
				this.showAchievementPanel(6);				
				// Atualiza conquista obtida
				conquistas[6] = true;
				// Entrega prêmio
				//TaCerto.Estrutura.Jogador.moeda += TaCerto.Estrutura.Conquistas.conquistas[6][2];
			}
		}
		
		if(!conquistas[7]){ // Checa a conquista 7
			if(moneyTotal >= 50){
				this.showAchievementPanel(7);				
				// Atualiza conquista obtida
				conquistas[7] = true;
				// Entrega prêmio
				//TaCerto.Estrutura.Jogador.moeda += TaCerto.Estrutura.Conquistas.conquistas[7][2];
			}
		}
		if(!conquistas[8]){ // Checa a conquista 8
			if(moneyTotal >= 100){
				this.showAchievementPanel(8);				
				// Atualiza conquista obtida
				conquistas[8] = true;
				// Entrega prêmio
				//TaCerto.Estrutura.Jogador.moeda += TaCerto.Estrutura.Conquistas.conquistas[8][2];
			}
		}
		
		if(!conquistas[9]){ // Checa a conquista 9
			if(moneyTotal >= 1000){
				this.showAchievementPanel(9);				
				// Atualiza conquista obtida
				conquistas[9] = true;
				// Entrega prêmio
				//TaCerto.Estrutura.Jogador.moeda += TaCerto.Estrutura.Conquistas.conquistas[9][2];
			}
		}

		if(!conquistas[10]){ // Checa a conquista 10
			if(totalDeCartasUsadas > 0){
				this.showAchievementPanel(10);				
				// Atualiza conquista obtida
				conquistas[10] = true;
				// Entrega prêmio
				//TaCerto.Estrutura.Jogador.moeda += TaCerto.Estrutura.Conquistas.conquistas[9][2];
			}
		}

		if(!conquistas[11]){ // Checa a conquista 11
			if(totalDeCartasUsadas >= 10){
				this.showAchievementPanel(11);				
				// Atualiza conquista obtida
				conquistas[11] = true;
				// Entrega prêmio
				//TaCerto.Estrutura.Jogador.moeda += TaCerto.Estrutura.Conquistas.conquistas[9][2];
			}
		}

		if(!conquistas[12]){ // Checa a conquista 12
			if(totalDeCartasUsadas >= 100){
				this.showAchievementPanel(12);				
				// Atualiza conquista obtida
				conquistas[12] = true;
				// Entrega prêmio
				//TaCerto.Estrutura.Jogador.moeda += TaCerto.Estrutura.Conquistas.conquistas[9][2];
			}
		}
	},
	showAchievementPanel: function(id){
		
		var achievs = TaCerto.Estrutura.Conquistas.conquistas;
		var achievementPanel = document.getElementById("achievementPanel");
		const idRandom = Math.random();
		this.model.idGlobal = idRandom;
 
		if(this.model.idGlobal === 0){
			;
		}else{
			
				console.log("oia");
				achievementPanel.innerHTML = ' ';
				achievementPanel.style.height = '0%';
				achievementPanel.classList.remove("animaAchievementWrapper2");
				achievementPanel.classList.remove("animaAchievementWrapper");
		
			
		}

		setTimeout(function(){
			console.log(idRandom);

			console.log(TaCerto.Controladora.MenuConquistas.model.idGlobal);

			if(idRandom !== TaCerto.Controladora.MenuConquistas.model.idGlobal)
				return;

			var currentAchiev = achievs[id];
			achievementPanel.innerHTML = ' ';
			achievementPanel.innerHTML = '<img class="imgConquistaPanel" src="resources/media/image/'+currentAchiev[3]+'.jpg" alt=""><div class="textMidConquistaPanel"><h4 class="titlePanel">'+currentAchiev[0]+'</h4></div><img class="imgConquistaPanel2" src="resources/media/image/'+currentAchiev[4]+'.png" alt="">';
			
			achievementPanel.classList.add("animaAchievementWrapper");
			achievementPanel.style.height = "100%"; 

			
			setTimeout(function(){

				if(idRandom !== TaCerto.Controladora.MenuConquistas.model.idGlobal)
					return;

				achievementPanel.classList.remove("animaAchievementWrapper");
				
				setTimeout(function(){
					if(idRandom !== TaCerto.Controladora.MenuConquistas.model.idGlobal)
						return;

					achievementPanel.classList.add("animaAchievementWrapper2");
					achievementPanel.style.height = "0%";

					setTimeout(function(){
						if(idRandom !== TaCerto.Controladora.MenuConquistas.model.idGlobal)
							return;

						achievementPanel.classList.remove("animaAchievementWrapper2");
					
						TaCerto.Controladora.MenuConquistas.model.timeOutSnackBar = undefined;
						achievementPanel.innerHTML = ' ';
						
						TaCerto.Controladora.MenuConquistas.model.idGlobal = 0;
					}, 700);
				}, 10);
			}, 5000);
		},10);
		
				
	}
};