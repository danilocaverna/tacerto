var TaCerto = TaCerto || {};
TaCerto.Controladora = TaCerto.Controladora || {};
TaCerto.Controladora.MenuMissao = {
	modoTipo: '',
	modoNivel: 0,
	load: function(){
		TaCerto.Controladora.CarregarPagina.htmlCorpo("menuMissao",["dica"],["dica"]);
		document.getElementById('moedas').innerHTML = TaCerto.Estrutura.Jogador.moeda;

		function calculaLvl(xp){
			var level = 1;
			xp-=200;
			while(xp !== 0)
				xp -= xp > 0 ? ++level * 100 : level-- * 0 + xp;
			return level;
		}
		var resolveAnimationXpBar = (async ()=>{
			var level = calculaLvl(TaCerto.Estrutura.Jogador.xp);
			var xpBar = document.getElementsByClassName('back_xpBar')[0];
			var nextXp = document.getElementById('xpNextLevel');
			var nextLevelXp = 200;
			
			for (let i = 0; i < level; i++) {
				nextLevelXp += (i + 2)* 100;

				nextXp.innerHTML = nextLevelXp;
				xpBar.style.transition = "width 0s";
				xpBar.style.width = "0";
				//primeiro ele desenha e depois conta as mudanças que eu fiz em cima por isso ele precisa ser chamado duas vezes
				await promiseRequestAnimationFrame();
				await promiseRequestAnimationFrame();

				xpBar.style.transition = "width 0.3s";
				xpBar.style.width = "100%";
				await delay(300);
			}
			xpBar.style.transition = "width 0s";
			xpBar.style.width = "0";
			await promiseRequestAnimationFrame();
			await promiseRequestAnimationFrame();

			var deltaXp = nextLevelXp - (level + 1)* 100;
			deltaXp = ((TaCerto.Estrutura.Jogador.xp - deltaXp)/(nextLevelXp - deltaXp))*100;
			xpBar.style.width = deltaXp === 0 ? 0 : deltaXp > 10 ? deltaXp + "%" : "10%";
		})();
		var resolveAnimationXpNumero = (async ()=>{
			var xpTotal = document.getElementById('xpTotal');
			var xp = 0;
			while(TaCerto.Estrutura.Jogador.xp >= xp){
				xpTotal.innerHTML = xp;
				xp += 100;
				await promiseRequestAnimationFrame();
				await promiseRequestAnimationFrame();
				await delay(100);
			}
		})();

		var resolveMissionsDisplay = (()=>{
			var level = calculaLvl(TaCerto.Estrutura.Jogador.xp);
			for (var i = 0; i < level+3 && i < 9; i++) {
				let aux = TaCerto.Estrutura.Jogador.missoes[i];
				if(document.getElementById('imgMissa'+(i+1))){
					if (aux[0] && aux[1] && aux[2])
						document.getElementById('imgMissa'+(i+1)).src = "resources/media/image/missao" + (i+1) + ".png";
					else
						document.getElementById('imgMissa'+(i+1)).src = "resources/media/image/missao" + (i+1) + "SE.png";
				}
			}
		})();
	},

	clickMissao: function(mission){
		var missao = document.getElementById('imgMissa' + (mission+1));
		if (!missao.src.includes("resources/media/image/lock.png")){
			
			TaCerto.GenFunc.fadeInBtnClick(missao, function(){
				TaCerto.Controladora.MenuMissao.modalOpenClose(true);

				document.getElementById('objetivoP1').innerHTML = TaCerto.Estrutura.Fase[mission].descricaoObjetivos[0];
				document.getElementById('objetivoP2').innerHTML = TaCerto.Estrutura.Fase[mission].descricaoObjetivos[1];
				document.getElementById('objetivoP3').innerHTML = TaCerto.Estrutura.Fase[mission].descricaoObjetivos[2];
				TaCerto.Controladora.MenuMissao.modoTipo = document.getElementById('modoTipo').innerHTML = TaCerto.Estrutura.Fase[mission].tipo;
				TaCerto.Controladora.MenuMissao.modoNivel = mission;

				var aux = TaCerto.Estrutura.Jogador.missoes[mission];
				if (aux[0]) document.getElementById('modalImgMissao1').src = "resources/media/image/checkedbox.png";
				else document.getElementById('modalImgMissao1').src = "resources/media/image/uncheckedbox.png";
				if (aux[1]) document.getElementById('modalImgMissao2').src = "resources/media/image/checkedbox.png";
				else document.getElementById('modalImgMissao2').src = "resources/media/image/uncheckedbox.png";
				if (aux[2]) document.getElementById('modalImgMissao3').src = "resources/media/image/checkedbox.png";
				else document.getElementById('modalImgMissao3').src = "resources/media/image/uncheckedbox.png";
			});				
		}
		else{
			missao.classList.add("animated"); missao.classList.add("flash"); 
			setTimeout(function () {missao.classList.remove("animated", "flash");}, 1000);
		}
	},
	modalClick: function(el, botao){
		TaCerto.GenFunc.pressClick(el,
		function(){
			if(botao)
				TaCerto.Controladora.MenuMissao.modalOpenClose(false);
			if(botao === "play"){
				TaCerto.Controladora.Jogo.Load(TaCerto.Controladora.MenuMissao.modoTipo, TaCerto.Controladora.MenuMissao.modoNivel);
			}
		});

		var e = window.event;
		e.cancelBubble = true;
		if (e.stopPropagation) e.stopPropagation();
	},
	modalOpenClose: function(flag){
		//find and display block the modal
		var modal = document.getElementById("missaoModal");
		modal.style.display = flag ? "block" : "none";
		//blur game blend
		var blurThis = [document.getElementsByClassName('gameBlend')[0], document.getElementsByClassName('menuMissao_wrapper')[0]];
		for (var i = 0; i < blurThis.length; i++) {
			blurThis[i].style.filter = flag ? "blur(5px)" : "none";
		}
	},
	homebtn: function(el){
		TaCerto.GenFunc.fadeInBtnClick(el,
		function(){
			//TaCerto.Controladora.CarregarPagina.htmlCorpo('menuInicial');
			TaCerto.Controladora.MenuInicial.load();
		});
	},
	lojabtn: function(el){
		TaCerto.GenFunc.fadeInBtnClick(el,
		function(){
			TaCerto.Controladora.Loja.display();
		});
	},
};