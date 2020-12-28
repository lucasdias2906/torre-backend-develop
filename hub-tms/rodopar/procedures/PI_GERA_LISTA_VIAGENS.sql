USE [db_visual_mirassol_teste]
GO

/****** Object:  StoredProcedure [dbo].[PI_GERA_LISTA_VIAGENS]    Script Date: 29/06/2020 20:44:52 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- ====================================================
-- Create date: 07/05/2020
-- Description:	Lista as viagens com base no manifesto de carga
--            - TIPO_LISTA:  “V “ = Retornará as etapas da viagem (manifesto de carga) agrupados por remetente e destinatário
--                           “D” OU NULL =  Retornará a viagem detalhada sem agrupamento
--            - Dados do manifesto de carga (Filial, serie e código) é opcional, 
--              quando informado acrescentará a lista de viagens independente do status do manifesto de carga
--
-- Parametro de Saida: Quando retorno “OK” a relação foi gerado com sucesso, diferente de mensagem de erros.
-- =====================================================
CREATE PROCEDURE [dbo].[PI_GERA_LISTA_VIAGENS]
                 @PAR_TIPO_LISTA CHAR(1),  -- D=VIAGENS DETALHADA; V OU NULL=VIAGENS 
                 @PAR_CODFIL SMALLINT, 
				 @PAR_SERIE CHAR(3),
				 @PAR_CODMAN INTEGER,
				 @RETORNO nvarchar(500) output -- EM CASO DE ERROS
AS
BEGIN
  SET NOCOUNT ON;
  SET XACT_ABORT ON;
  DECLARE @err_message nvarchar(250);
  --
  -- Tabela de retorno com as viagens em andamento
  --
  DECLARE @VIAGENS_TEMP TABLE
  (codigoFilialManifesto int,
   serieManifesto varchar(3),
   codigoManifesto integer,
   dataManifesto datetime,
   dataSaidaManifesto datetime, 
   dataLimiteEntrega datetime,
   placaVeiculo varchar(8),
   Veiculo varchar(8),
   codigoClassificacaoVeiculo smallint,
   placaVeiculo2 varchar(8),
   Veiculo2 varchar(8),
   codigoClassificacaoVeiculo2 smallint,
   placaoVeiculo3 varchar(8),
   Veiculo3 varchar(8),
   codigoClassificacaoVeiculo3 smallint,
   placaVeiculo4 varchar(8),
   Veiculo4 varchar(8),
   codigoClassificacaoVeiculo4 smallint,
   placaVeiculo5 varchar(8),
   Veiculo5 varchar(8),
   codigoClassificacaoVeiculo5 smallint,
   codigoMotorista1 integer,
   codigoMotorista2 integer,
   codigoTomador integer,
   codigoLinha varchar(6),
   --
   -- Colunas de coleta e a entrega definidas pelo processo
   codigoLinhaTrecho varchar(6),
   codigoLocalColeta integer,
   dataColeta datetime,
   codigoLocalEntrega integer,
   dataEntrega datetime,
   --
   -- Colunas de origem dos docs do manifesto de carga
   tipoDocumentoOrigem varchar(3),
   codigoFilialDocOrigem smallint,
   serieDOcumentoOrigem char(3),
   codigoDocumentoOrigem Integer,
   ORDEM smallint,
   ORDMAN integer,
   --
   codigoRemetente integer, 
   codigoTerminalColeta integer, 
   codigoDestinatrio integer,
   codigoTerminalEntrega integer,
   --
   -- Colunas da Programação do veiculo e Pedido (PC)
   codigofilialPV SMALLINT,  
   codigoPV INTEGER, 
   codigoReferenciaCliente VARCHAR(240),
   codigoFilialPedido SMALLINT,  
   codigoPedido INTEGER,
   --
   dataRetiradaPC datetime,
   ddataChegadaPC datetime,
   dataChegadaPrevistaPV datetime
   );
  --
  -- Tabela de retorno com as viagens em andamento
  -- agrupado por remente e destinário
  --
  DECLARE @VIAGENS TABLE
  (codigoFilialManifesto int,
   serieManifesto varchar(3),
   codigoManifesto integer,
   placaVeiculo varchar(8),
   Veiculo varchar(8),
   codigoClassificacaoVeiculo smallint,
   placaVeiculo2 varchar(8),
   Veiculo2 varchar(8),
   codigoClassificacaoVeiculo2 smallint,
   placaoVeiculo3 varchar(8),
   Veiculo3 varchar(8),
   codigoClassificacaoVeiculo3 smallint,
   placaVeiculo4 varchar(8),
   Veiculo4 varchar(8),
   codigoClassificacaoVeiculo4 smallint,
   placaVeiculo5 varchar(8),
   Veiculo5 varchar(8),
   codigoClassificacaoVeiculo5 smallint,
   codigoMotorista1 integer,
   codigoMotorista2 integer,
   codigoTomador integer,
   codigoLinha varchar(6),
   -- 
   codigoFilialPedido smallint,
   codigoPedido varchar(240),
   codigoAgrupadorTorre varchar(240),
   -- Colunas de coleta e a entrega definidas por processo
   ORDEM integer,
   ORDMAN integer,
   codigoLinhaTrecho varchar(6),
   codigoLocalColeta integer,
   nomeLocalColeta varchar(100),
   latitudeLocalColeta FLOAT (53) , 
   longitudeLocalColeta FLOAT (53) , 
   raioMetrosLocalColeta decimal(6,2) , 
   dataColeta datetime,
   codigoLocalEntrega integer,
   nomeLocalEntrega varchar(100),
   latitudeLocalEntrega FLOAT (53) , 
   longitudeLocalEntrega FLOAT (53) , 
   raioMetrosLocalEntrega decimal(6,2), 
   dataEntrega datetime);
  --
  -- ******************************************************************************
  -- ETAPA 1 - Recuperar os manifestos de cargas com status = E - Emitido
  -- ******************************************************************************
  --
  BEGIN TRY
	--
    print 'PI_GERA_LISTA_VIAGENS INICIO=>' + CONVERT(VARCHAR(30), GETDATE(), 114);
    --
    set @err_message = 'BSUCANDO OS MANIFESTOS DE CARGA EMITIDOS';
    --
	DECLARE ManifestosEmViagem CURSOR FOR
    SELECT 
		RODMAN.CODFIL,
		RODMAN.SERMAN,
		RODMAN.CODMAN,
		RODMAN.DATEMI,
		RODMAN.DATINI,
		RODMAN.DATLME,
		--
 		RODMAN.PLACA,
		VEI.NUMVEI,
		CMO.CODCMO,
		--
		RODMAN.PLACA2,
		VEI2.NUMVEI NUMVEI2,
		CMO2.CODCMO CODCMO_VEI2,
		--
		RODMAN.PLACA3,
		VEI3.NUMVEI NUMVEI3,
		CMO3.CODCMO CODCMO_VEI3,
		--
		RODMAN.PLACA4,
		VEI4.NUMVEI NUMVEI4,
		CMO4.CODCMO CODCMO_VEI4,
		--
		RODMAN.PLACA5,
		VEI5.NUMVEI NUMVEI5,
		CMO5.CODCMO CODCMO_VEI5,
		--
		RODMAN.CODMO1,
		RODMAN.CODMO2, 
		RODMAN.CODLIN
	FROM RODMAN -- Manifesto de carga aonde estao as viagens
	INNER JOIN RODVEI VEI ON VEI.CODVEI = RODMAN.PLACA
	LEFT OUTER JOIN RODCMO CMO on VEI.CODCMO = CMO.CODCMO -- cad. de classificacao de veiculos
	LEFT OUTER JOIN RODVEI VEI2 ON VEI2.CODVEI = RODMAN.PLACA2
	LEFT OUTER JOIN RODCMO CMO2 on VEI2.CODCMO = CMO2.CODCMO -- cad. de classificacao de veiculos
	LEFT OUTER JOIN RODVEI VEI3 ON VEI3.CODVEI = RODMAN.PLACA3
	LEFT OUTER JOIN RODCMO CMO3 on VEI3.CODCMO = CMO3.CODCMO -- cad. de classificacao de veiculos
	LEFT OUTER JOIN RODVEI VEI4 ON VEI4.CODVEI = RODMAN.PLACA4
	LEFT OUTER JOIN RODCMO CMO4 on VEI4.CODCMO = CMO4.CODCMO -- cad. de classificacao de veiculos
	LEFT OUTER JOIN RODVEI VEI5 ON VEI5.CODVEI = RODMAN.PLACA5
	LEFT OUTER JOIN RODCMO CMO5 on VEI5.CODCMO = CMO5.CODCMO -- cad. de classificacao de veiculos
	WHERE (RODMAN.CODFIL = @PAR_CODFIL
	  and rodman.serman = @PAR_SERIE
	  and rodman.codman = @PAR_CODMAN)
      OR RODMAN.SITUAC in ('D','E'); -- EM VIAGEM; -- rodman.AUTGER 
	--
    DECLARE @codigoFilialManifesto int,
	        @serieManifesto varchar(3),
	        @codigoManifesto integer,
	        @dataManifesto datetime,
			@dataSaidaManifesto datetime,
			@dataLimiteEntrega datetime,
	        @placaVeiculo varchar(8), -- CODIGO DA PLACA 1
	        @Veiculo varchar(8),
	        @codigoClassificacaoVeiculo smallint,
   	        @placaVeiculo2 varchar(8), -- CODIGO DA PLACA 2
   	        @Veiculo2 varchar(8),
	        @codigoClassificacaoVeiculo2 smallint,
	        @placaoVeiculo3 varchar(8), -- CODIGO DA PLACA 3
	        @Veiculo3 varchar(8),
	        @codigoClassificacaoVeiculo3 smallint,
	        @placaVeiculo4 varchar(8), -- CODIGO DA PLACA 4
	        @Veiculo4 varchar(8),
	        @codigoClassificacaoVeiculo4 smallint,
	        @placaVeiculo5 varchar(8),-- CODIGO DA PLACA 5
	        @Veiculo5 varchar(8),
	        @codigoClassificacaoVeiculo5 smallint,
	        @codigoMotorista1 integer,
	        @codigoMotorista2 integer,
	        @codigoLinha varchar(6);
    --
	-- *********************
	-- inicio do processo...
	-- *********************
    SET @err_message = 'ABRIR CURSOR MANIFESTOS';
	--
	print 'OPEN CURSOS MANIFESTOS';
	--
    OPEN ManifestosEmViagem; 
    --
    SET @err_message = 'FECH CURSOR MANIFESTOS';
	--
    FETCH NEXT FROM ManifestosEmViagem 
    INTO @codigoFilialManifesto, @serieManifesto,  @codigoManifesto, 
	     @dataManifesto, @dataSaidaManifesto,  @dataLimiteEntrega, 
	     @placaVeiculo, @Veiculo, @codigoClassificacaoVeiculo,
   	     @placaVeiculo2, @Veiculo2, @codigoClassificacaoVeiculo2,
	     @placaoVeiculo3, @Veiculo3, @codigoClassificacaoVeiculo3,
	     @placaVeiculo4, @Veiculo4, @codigoClassificacaoVeiculo4,
	     @placaVeiculo5, @Veiculo5, @codigoClassificacaoVeiculo5,
	     @codigoMotorista1, @codigoMotorista2,
	     @codigoLinha;
    --
    WHILE @@FETCH_STATUS = 0 
	  --
	  BEGIN
	    print 'MANIFESTO DE CARGA=>' + CAST(@codigoFilialManifesto AS VARCHAR)+'/'+ CAST(@serieManifesto AS VARCHAR) +'/'+ CAST(@codigoManifesto AS VARCHAR);	    
		--
		BEGIN
        --
        -- ******************************************************************************
        -- Etapa 2: Recuperar os documentos dos manifesto de carga: CTRC/OST/ACT/Descolamento Vazio
        -- ******************************************************************************
	    --
		DECLARE EtapasViagem CURSOR FOR
        -- **** CTE **** 
        SELECT  RODIMA.TIPDOC,
                RODIMA.FILDOC,
                RODIMA.SERDOC,
                RODIMA.CODDOC,
               ISNULL(RODIMA.ORDEM,0) AS ORDMAN,
               ISNULL(RODIMA.ORDMAN,0) AS ORDEM,
                --
                RODCON.DATEMI,
                RODCON.CODLIN,
                --
               null DAT_SAI_DOC, -- CTE NAO TEM ESTA INFORMACAO
               null DAT_LME_DOC, -- CTE NAO TEM ESTA INFORMACAO
				RODCON.CODPAG,
                -- REMETENTE E DESTINARIO
                RODCON.CODREM,
                RODCON.CODDES,
                -- terminal de coleta e entrega
                RODCON.TERCOL COD_TERCOL,
                RODCON.TERENT COD_TERENT,
                -- OST/ACT RECUPERADA COM BASE NO CTE DO MANIFESTO
                CASE
                  WHEN RODORD.CODIGO IS NOT NULL THEN
                   'O'
                  WHEN ACT.CODIGO IS NOT NULL THEN
                   'A'
                  WHEN ACT.CODIGO IS NULL THEN
                    NULL
                END TIP_DOC_ORIGEM,
                --
                CASE
                  WHEN RODORD.CODFIL IS NOT NULL THEN
                   RODORD.CODFIL
                  WHEN ACT.CODFIL IS NOT NULL THEN
                   ACT.CODFIL
                  WHEN ACT.CODFIL IS NULL THEN
                   NULL
                END CODFIL_DOC_ORIG,
                --
                CASE
                  WHEN RODORD.SERORD IS NOT NULL THEN
                   RODORD.SERORD
                  WHEN ACT.SERCOL IS NOT NULL THEN
                   ACT.SERCOL
                  WHEN ACT.SERCOL IS NULL THEN
                   NULL
                END SERIE_DOC_ORIG,
                --
                CASE
                  WHEN RODORD.CODIGO IS NOT NULL THEN
                   RODORD.CODIGO
                  WHEN ACT.CODIGO IS NOT NULL THEN
                   ACT.CODIGO
                  WHEN ACT.CODIGO IS NULL THEN
                    NULL
                END CODIGO_DOC_ORIG
          FROM RODIMA
         INNER JOIN RODCON RODCON ON RODCON.CODFIL = RODIMA.FILDOC
                                 AND RODCON.SERCON = RODIMA.SERDOC
                                 AND RODCON.CODCON = RODIMA.CODDOC
                                 AND RODCON.SITUAC NOT IN ('I', 'C') -- EMITIDO, BAIXADO, CADASTRADO
        -- Recupera a OST com base no CTE (Tabela associativa)
          LEFT OUTER JOIN RODORC RODORC ON (RODORC.CODCON = RODCON.CODCON AND
                                           RODORC.SERCON = RODCON.SERCON AND
                                           RODORC.FILCON = RODCON.CODFIL)
          LEFT OUTER JOIN RODORD RODORD ON (RODORD.CODFIL = RODORC.FILORD AND
                                           RODORD.SERORD = RODORC.SERORD AND
                                           RODORD.CODIGO = RODORC.CODORD)
        -- Recupera a ACT com base na CTE (Tabela associativa)
          LEFT OUTER JOIN RODCOC COC ON COC.FILCON = RODCON.CODFIL -- Associativa ACT vs CTE
                                    AND COC.CODCON = RODCON.CODCON
                                    AND COC.SERCON = RODCON.SERCON
          LEFT OUTER JOIN RODCOL ACT ON COC.CODCOL = ACT.CODIGO
                                    AND COC.SERCOL = ACT.SERCOL
                                    AND COC.FILCOL = ACT.CODFIL
         Where RODIMA.CODMAN = @codigoManifesto
		   AND RODIMA.SERMAN = @serieManifesto
           AND RODIMA.FILMAN = @codigoFilialManifesto
		   AND RODIMA.TIPDOC = 'C' --  CTE
        --
        UNION ALL
        -- **** COLETA CONTAINTER - ACT ****
        SELECT RODIMA.TIPDOC,
               RODIMA.FILDOC,
               RODIMA.SERDOC,
               RODIMA.CODDOC,
               ISNULL(RODIMA.ORDEM,0) AS ORDMAN,
               ISNULL(RODIMA.ORDMAN,0) AS ORDEM,
               --
               RODCOL.DATEMI,
               RODCOL.CODLIN,
               --
               null DAT_SAI_DOC, -- ACT NAO TEM ESTA INFORMACAO
               null DAT_LME_DOC, -- ACT NAO TEM ESTA INFORMACAO
			   RODCOL.CODPAG,
               -- REMETENTE E DESTINARIO
               RODCOL.CODREM,
               RODCOL.CODDES,
               -- terminal de coleta e entrega
               RODCOL.TERCOL COD_TERCOL,
               RODCOL.TERENT COD_TERENT,
               null          TIP_DOC_ORIGEM,
               null          CODFIL_DOC_ORIG,
               null          SERIE_DOC_ORIG,
               null          CODIGO_DOC_ORIG
        --
          FROM RODIMA, RODCOL
         Where RODIMA.CODMAN = @codigoManifesto
		   AND RODIMA.SERMAN = @serieManifesto
           AND RODIMA.FILMAN = @codigoFilialManifesto
           AND RODIMA.TIPDOC = 'A' -- ACT
		   --
		   AND RODCOL.CODFIL = RODIMA.FILDOC
           AND RODCOL.SERCOL = RODIMA.SERDOC
           AND RODCOL.CODIGO = RODIMA.CODDOC
           AND RODCOL.SITUAC NOT IN ('I', 'C') -- CADASTRADA, EMITIDO, BAIXADO
        --
        UNION ALL
        -- **** RODORD - COLETA ** OST ******
        SELECT RODIMA.TIPDOC,
               RODIMA.FILDOC,
               RODIMA.SERDOC,
               RODIMA.CODDOC,
               ISNULL(RODIMA.ORDEM,0) AS ORDMAN,
               ISNULL(RODIMA.ORDMAN,0) AS ORDEM,
               --
               RODORD.DATEMI,
               RODORD.CODLIN,
               --
               null DAT_SAI_DOC, -- OST NAO TEM ESTA INFORMACAO
               null DAT_LME_DOC, -- OST NAO TEM ESTA INFORMACAO
			   RODORD.CODPAG,
               -- REMETENTE E DESTINARIO
               RODORD.CODREM,
               RODORD.CODDES,
               -- terminal de coleta e entrega
               RODORD.TERCOL COD_TERCOL,
               RODORD.TERENT COD_TERENT,
               null          TIP_DOC_ORIGEM,
               null          CODFIL_DOC_ORIG,
               null          SERIE_DOC_ORIG,
               null          CODIGO_DOC_ORIG
        --
          FROM RODIMA, RODORD
         Where RODIMA.CODMAN = @codigoManifesto
		   AND RODIMA.SERMAN = @serieManifesto
           AND RODIMA.FILMAN = @codigoFilialManifesto
           AND RODIMA.TIPDOC = 'O'
		   AND RODORD.CODFIL = RODIMA.FILDOC
           AND RODORD.SERORD = RODIMA.SERDOC
           AND RODORD.CODIGO = RODIMA.CODDOC
           AND RODORD.SITUAC NOT IN ('I', 'C') -- EMITIDO, BAIXADO, CADASTRADO
        --
        UNION ALL
        -- *** DESLOCAMENTO VAZIO
        SELECT RODIMA.TIPDOC,
               RODIMA.FILDOC,
               RODIMA.SERDOC,
               RODIMA.CODDOC,
               ISNULL(RODIMA.ORDEM,0) AS ORDMAN,
               ISNULL(RODIMA.ORDMAN,0) AS ORDEM,
               --
               RODVAZ.DATINC,
               RODVAZ.CODLIN,
               --
               RODVAZ.DATSAI DAT_SAI_DESLC,
               RODVAZ.DATPRE DAT_LME_DESLC,
			   NULL, -- CODPAG NÃO TEM PARA DESLOCAMENTO VAZIO
               -- REMETENTE E DESTINARIO
               RODVAZ.CODREM CODREM,
               RODVAZ.CODDES CODDES,
               -- terminal de coleta e entrega
               null          TERCOL,
               RODVAZ.FILDES TERENT, -- Cadastro de filial (nao eh o parceiro comercial)
               null          TIP_DOC_ORIGEM,
               null          CODFIL_DOC_ORIG,
               null          SERIE_DOC_ORIG,
               null          CODIGO_DOC_ORIG
        --
          FROM RODIMA, RODVAZ                         
         Where RODIMA.CODMAN = @codigoManifesto
		   AND RODIMA.SERMAN = @serieManifesto
           AND RODIMA.FILMAN = @codigoFilialManifesto
           AND RODIMA.TIPDOC = 'D' -- DESLOCAMENTO VAZIO
		   --
		   AND RODVAZ.CODFIL = RODIMA.FILDOC
		   AND RODIMA.SERDOC = ' '
           AND RODVAZ.CODVAZ = RODIMA.CODDOC
           AND RODVAZ.SITUAC NOT IN ('I', 'C') -- CADASTRADO, BAIXADO, EMITIDO
		   --
         ORDER BY ORDEM, ORDMAN;
       --
	   DECLARE @TIPDOC CHAR(1),
               @FILDOC SMALLINT,
               @SERDOC VARCHAR(3),
               @CODDOC integer,
               @ORDEM smallint,
               @ORDMAN integer,
               @DATEMI smalldatetime,
               @CODLIN varchar(6),
               @DAT_SAI_DOC smalldatetime, 
               @DAT_LME_DOC smalldatetime,
			   @codigoTomador integer,
               @CODREM integer,
               @CODDES integer,
               @COD_TERCOL integer,
               @COD_TERENT integer,
               @TIP_DOC_ORIGEM char(1),
               @CODFIL_DOC_ORIG smallint,
               @SERIE_DOC_ORIG varchar(3),
               @CODIGO_DOC_ORIG integer;
        --
        -- Recuperando os documentos associdos ao manifesto de carga para obter as etapas da viagem
		--
		  --
	      SET @err_message = 'OPEN CURSOR EtapasViagem';
	      --
	      print 'OPEN CURSOS EtapasViagem';
		  OPEN EtapasViagem;
		  --
		  FETCH NEXT FROM EtapasViagem 
		  INTO @TIPDOC, @FILDOC, @SERDOC, @CODDOC, @ORDEM, @ORDMAN,
               @DATEMI, @CODLIN,
               @DAT_SAI_DOC, @DAT_LME_DOC,
               @codigoTomador, @CODREM, @CODDES,
               @COD_TERCOL, @COD_TERENT,
               @TIP_DOC_ORIGEM, @CODFIL_DOC_ORIG, @SERIE_DOC_ORIG, @CODIGO_DOC_ORIG;
          --
          WHILE @@FETCH_STATUS = 0 
		  BEGIN
		  --
	      print 'ETAPAS DA VIAGEM=>' + @TIPDOC + ' ' + CAST(@FILDOC AS VARCHAR)+'/'+ CAST(@SERDOC AS VARCHAR) +'/'+ CAST(@CODDOC AS VARCHAR);	
          --
          -- ******************************************************************************************************
          -- Etapa 3: Recuperar a programação do veículo e programação de carga, quando não for deslocamento vazio
          -- ******************************************************************************************************
	      --
		  BEGIN
			 --
             IF isnull(@TIPDOC,'X') <> 'D'  
				 --
				 BEGIN
				 --
				 DECLARE @CODFIL_PED SMALLINT,
						 @CODSER_PED CHAR(3),
						 @CODIGO_PED INTEGER,
						 @TIPDOC_PED CHAR(1),
						 @localColeta integer,
						 @dataColeta datetime,
						 @localEntrega integer,
						 @dataEntrega datetime;
				 --
				 -- Decisao de qual documento sera utilizada para buscar a PV e PC, 
				 -- com base nos documentos recuperados no passo anterior.
				 --
				 IF ISNULL(@TIP_DOC_ORIGEM,'X') <> 'X'
					BEGIN
					  SET @CODFIL_PED = @CODFIL_DOC_ORIG;
					  SET @CODSER_PED = @SERIE_DOC_ORIG;
					  SET @CODIGO_PED = @CODIGO_DOC_ORIG;
					  SET @TIPDOC_PED = @TIP_DOC_ORIGEM;
					END;
				 ELSE
					BEGIN
					  print 'localizr a PV=>' + @TIPDOC_PED + ' ' +  CAST(@CODFIL_PED AS VARCHAR) + '/' + CAST(@CODIGO_PED AS VARCHAR) +'/'+ @CODSER_PED;	
					  SET @CODFIL_PED = @FILDOC;
					  SET @CODSER_PED = @SERDOC;
					  SET @CODIGO_PED = @CODDOC;
					  SET @TIPDOC_PED = @TIPDOC;
					END;
				 --
				 -- LOCALIZAR O PEDIDO REFERENTE A ETAPA DA VIAGEM
				 --
				 DECLARE PEDIDO CURSOR FOR
				 SELECT DISTINCT
				   RODDPRV.FILPRO filialPV,
				   RODDPRV.CODPRO codigoPV,
      			   RODIPR.ORDCOM,
				   --
				   RODDPRC.FILPRO filialPC,
				   RODDPRC.CODPRO codigoPC,
				   --
				   RODPRC.DATRET dataRetirada,
				   RODPRC.DATENT dataChegada,
				   RODLPR.PRECHE dataChegadaPrevista
				 FROM RODDPR RODDPRV
				 INNER JOIN RODLPR RODLPR ON (RODLPR.CODFIL = RODDPRV.FILPRO
										  AND RODLPR.CODLPR = RODDPRV.CODPRO)
				 INNER JOIN RODDPR RODDPRC ON (RODDPRC.CODDOC = RODLPR.CODLPR
										   AND ISNULL(RODDPRC.SERDOC,' ') = ' '
										   AND RODDPRC.FILDOC = RODLPR.CODFIL
             							  AND RODDPRC.TIPDOC = 'V')
				 INNER JOIN RODPRC ON (RODPRC.CODFIL = RODDPRC.FILPRO
								   AND RODPRC.CODIGO = RODDPRC.CODPRO)
                 INNER JOIN RODIPR on (RODIPR.CODIGO = RODPRC.CODIGO -- Destino(s) de programação para pegar agrupador Integrator
                                   AND RODIPR.CODFIL = RODPRC.CODFIL)	
				 WHERE RODDPRV.CODDOC = @CODIGO_PED
				   AND RODDPRV.SERDOC = @CODSER_PED
				   AND RODDPRV.FILDOC = @CODFIL_PED  
				   AND RODDPRV.TIPDOC = @TIPDOC_PED;
      			 --
      			 DECLARE  @filialPV SMALLINT,  @codigoPV INTEGER, @ORDCOM VARCHAR(240),
						  @filialPC SMALLINT,  @codigoPC INTEGER, 
						  @dataRetirada smalldatetime, @dataChegada smalldatetime, @dataChegadaPrevista smalldatetime;
				 --
				 SET @err_message = 'OPEN CURSOR PEDIDO';
				 --
				 print 'OPEN CURSOR PEDIDO';
				 OPEN PEDIDO;
				 --
				 FETCH NEXT FROM PEDIDO 
      			 INTO @filialPV, @codigoPV, @ORDCOM,
					  @filialPC, @codigoPC,
					  @dataRetirada, @dataChegada, @dataChegadaPrevista;
				 --
				 -- LOCALIZAR O PROXIMO PEDIDO REFERENTE A ETAPA DA VIAGEM
				 --
				 WHILE @@FETCH_STATUS = 0 
				 BEGIN
					  --
					  print 'PV=>' + CAST(@filialPV AS VARCHAR) + '/' + CAST(@codigoPV AS VARCHAR) + ' PC=>' + CAST(@codigoPC AS VARCHAR);	
                      --
                      -- **************************************************************************************************************************
                      -- Etapa 4: Gravar tabela temporário contendo as informações da origem, mais a decisão do local de coleta e entrega
                      -- **************************************************************************************************************************
	                  --
					  INSERT INTO @VIAGENS_TEMP VALUES
					  (@codigoFilialManifesto,
					   @serieManifesto,
					   @codigoManifesto,
					   @dataManifesto,
					   @dataSaidaManifesto, 
					   @dataLimiteEntrega,
					   @placaVeiculo,
				       @Veiculo,
					   @codigoClassificacaoVeiculo,
   					   @placaVeiculo2,
   					   @Veiculo2,
					   @codigoClassificacaoVeiculo2,
					   @placaoVeiculo3,
					   @Veiculo3,
					   @codigoClassificacaoVeiculo3,
					   @placaVeiculo4,
					   @Veiculo4,
					   @codigoClassificacaoVeiculo4,
					   @placaVeiculo5,
					   @Veiculo5,
					   @codigoClassificacaoVeiculo5,
					   @codigoMotorista1,
					   @codigoMotorista2,
					   @codigoTomador,
					   @codigoLinha,
					   -- Etapas Colunas de coleta e a entrega definidas pelo processo
					   @CODLIN,
					   --
				       -- Definição do local de coleta, caso tenha sido informado o terminal de coleta assumte o mesmo
				       --
				       CASE WHEN ISNULL(@COD_TERCOL,0) > 0 THEN @COD_TERCOL
				            WHEN ISNULL(@COD_TERCOL,0) = 0 THEN @CODREM END,
					   --
					   -- Definição da data de coleta assume da PC-Pedido
					   --
					   @dataRetirada,
					   --
			           -- Definição do local de entega, caso tenha sido informado o terminal de entraga assume o memsmo
				       --
				       CASE WHEN ISNULL(@COD_TERENT,0) > 0 THEN @COD_TERENT
				            WHEN ISNULL(@COD_TERENT,0) = 0 THEN @CODDES END,
					   --
					   -- Definição da data de entrega assume da PC-Pedido
					   --
					   @dataChegada,
					   --
					   -- Colunas de origem dos docs do manifesto de carga
					   @TIPDOC_PED,
					   @CODFIL_PED,
					   @CODSER_PED,
					   @CODIGO_PED,
					   @ORDEM,
					   @ORDMAN,
					   --
					   @CODREM,
					   @COD_TERCOL,
					   @CODDES,
					   @COD_TERENT,
					   -- Colunas da Programação do veiculo e Pedido (PC)
      				   @filialPV, 
					   @codigoPV, 
					   @ORDCOM,
					   @filialPC, 
					   @codigoPC,
					   --
					   @dataRetirada, 
					   @dataChegada, 
					   @dataChegadaPrevista);
					  --
					   FETCH NEXT FROM PEDIDO 
      				   INTO @filialPV, @codigoPV, @ORDCOM,
							@filialPC, @codigoPC,
							@dataRetirada, @dataChegada, @dataChegadaPrevista;
				 -- 
				 END
				 --
				 SET @err_message = 'CLOSE CURSOR PEDIDO';
				 --
				 print 'CLOSE CURSOR PEDIDO';
				 --
				 CLOSE PEDIDO;  
				 DEALLOCATE PEDIDO;
				 --
			   END;
          ELSE
            --
            -- **************************************************************************************************************************
            -- Etapa 4.1 Gravar tabela temporário contendo as informações da origem, mais a decisão do local de coleta e entrega
            -- **************************************************************************************************************************
		    -- Deslocamento Vazio (não possui PC/PV) trativa separada
			-- *******************************************************
		    BEGIN
			    --
				-- Substitui o codigo da filial 
				-- pelo codigo do parceiro comercial
				--
				SELECT
                   @COD_TERENT = min(RODCLI.CODCLIFOR)
                FROM RODFIL
                INNER JOIN RODCLI ON RODCLI.CODCGC = RODFIL.CODCGC
                WHERE RODFIL.CODFIL = @COD_TERENT;
				--
				-- Gravar a tabela de viagens
				--
				INSERT INTO @VIAGENS_TEMP VALUES
				(@codigoFilialManifesto,
				 @serieManifesto,
				 @codigoManifesto,
				 @dataManifesto,
				 @dataSaidaManifesto, 
				 @dataLimiteEntrega,
				 @placaVeiculo,
				 @Veiculo,
				 @codigoClassificacaoVeiculo,
   				 @placaVeiculo2,
   				 @Veiculo2,
				 @codigoClassificacaoVeiculo2,
				 @placaoVeiculo3,
				 @Veiculo3,
				 @codigoClassificacaoVeiculo3,
				 @placaVeiculo4,
				 @Veiculo4,
				 @codigoClassificacaoVeiculo4,
				 @placaVeiculo5,
				 @Veiculo5,
				 @codigoClassificacaoVeiculo5,
				 @codigoMotorista1,
				 @codigoMotorista2,
				 @codigoTomador,
				 @codigoLinha,
				-- Etapas Colunas de coleta e a entrega definidas pelo processo
				@CODLIN,
				--
				-- Definição do local de coleta, caso tenha sido informado o terminal de coleta assumte o mesmo
				--
				CASE WHEN ISNULL(@COD_TERCOL,0) > 0 THEN @COD_TERCOL
				     WHEN ISNULL(@COD_TERCOL,0) = 0 THEN @CODREM END, 
				--
			    -- Definição da data de coleta assume o Deslocamento Vazio
				--
				@DAT_SAI_DOC,
				--
			    -- Definição do local de entega, caso tenha sido informado o terminal de entraga assume o memsmo
				--
				CASE WHEN ISNULL(@COD_TERENT,0) > 0 THEN @COD_TERENT
				     WHEN ISNULL(@COD_TERENT,0) = 0 THEN @CODDES END,
			    --
				-- Definição da data de entrega assume o Deslocamento Vazio
				--
				@DAT_LME_DOC,
			    --
				-- Colunas de origem dos docs do manifesto de carga
				@TIPDOC_PED,
				@CODFIL_PED,
				@CODSER_PED,
				@CODIGO_PED,
				@ORDEM,
				@ORDMAN,
				--
				@CODREM,
				@COD_TERCOL,
				@CODDES,
				@COD_TERENT,
				-- Deslocamento vazio não tem PC/PV
      			null, -- filialPV, 
				null, -- codigoPV, 
				null, -- ORDCOM,
				null, -- filialPC, 
				null, -- codigoPC,
				--
				null, -- @dataRetirada, 
				null, -- @dataChegada, 
				null); -- @dataChegadaPrevista);
              END;
          END;
		  --
		  -- PROXIMA ETAPA DA VIAGEM
		  --
		  FETCH NEXT FROM EtapasViagem 
		  INTO @TIPDOC, @FILDOC, @SERDOC, @CODDOC, @ORDEM, @ORDMAN,
               @DATEMI, @CODLIN,
               @DAT_SAI_DOC, @DAT_LME_DOC,
               @codigoTomador, @CODREM, @CODDES,
               @COD_TERCOL, @COD_TERENT,
               @TIP_DOC_ORIGEM, @CODFIL_DOC_ORIG, @SERIE_DOC_ORIG, @CODIGO_DOC_ORIG;
		  END
		  --
	      SET @err_message = 'CLOSE CURSOR EtapasViagem';
	      --
	      print 'CLOSE CURSOS EtapasViagem';
	      --
	      CLOSE EtapasViagem;  
	      DEALLOCATE EtapasViagem;
	      --
		END
        --
        -- Proximo manifesto de carga
		--
	    SET @err_message = 'FECH CURSOR MANIFESTOS';
	    --
        FETCH NEXT FROM ManifestosEmViagem  
        INTO @codigoFilialManifesto, @serieManifesto,  @codigoManifesto, 
	         @dataManifesto, @dataSaidaManifesto,  @dataLimiteEntrega, 
	         @placaVeiculo, @Veiculo, @codigoClassificacaoVeiculo,
   	         @placaVeiculo2, @Veiculo2, @codigoClassificacaoVeiculo2,
	         @placaoVeiculo3, @Veiculo3, @codigoClassificacaoVeiculo3,
	         @placaVeiculo4, @Veiculo4, @codigoClassificacaoVeiculo4,
	         @placaVeiculo5, @Veiculo5, @codigoClassificacaoVeiculo5,
	         @codigoMotorista1, @codigoMotorista2,
	         @codigoLinha;
	END
	--
	SET @err_message = 'CLOSE CURSOR MANIFESTOS';
	--
	print 'CLOSE CURSOS MANIFESTOS';
	 --
	CLOSE ManifestosEmViagem;  
	DEALLOCATE ManifestosEmViagem;
	--
	IF ISNULL(@PAR_TIPO_LISTA,'X') = 'D'
	   BEGIN
	    -- ***********************************************************************************************************************
	    -- Etapa 5.1 Retorna a tabela de viagens e suas etapas com informações da origem e a decisão do local de coleta e entrega
	    -- ***********************************************************************************************************************
	    --
		SELECT * FROM @VIAGENS_TEMP;
		--
	    RETURN 
		SELECT 
		  VIA.*
		FROM @VIAGENS_TEMP VIA;
	    --
        PRINT 'PI_GERA_LISTA_VIAGENS FIM   =>' + CONVERT(VARCHAR(30), GETDATE(), 114);
	    --
	  END;
	ELSE
      -- **************************************************************************************************************************
      -- Etapa 5.2 Retorna a tabela de viagens e suas etapas de forma agrupada por remetente e destinatário
      -- **************************************************************************************************************************
	  BEGIN
	   --
	   -- AGRUPA A(S) ETAPA(S) DA VIAGEM POR LOCAL DE COLETA E REMETENTE
	   --
	   INSERT INTO @VIAGENS
	   SELECT V.* 
	   FROM 
	    (
		SELECT 
		  codigoFilialManifesto,
		  serieManifesto,
		  codigoManifesto,
		  placaVeiculo,
		  Veiculo,
		  codigoClassificacaoVeiculo,
		  placaVeiculo2,
		  Veiculo2,
		  codigoClassificacaoVeiculo2,
		  placaoVeiculo3,
		  Veiculo3,
		  codigoClassificacaoVeiculo3,
		  placaVeiculo4,
		  Veiculo4,
		  codigoClassificacaoVeiculo4,
		  placaVeiculo5,
		  Veiculo5,
		  codigoClassificacaoVeiculo5,
		  codigoMotorista1,
		  codigoMotorista2,
		  codigoTomador,
		  codigoLinha,
		  --
		  codigoFilialPedido,
		  numeroPedido numeroPedido,
		  (cast(codigoFilialPedido as varchar) + '/' + numeroPedido) codigoAgrupadorTorre,
		  --
		  MIN(ORDEM) ORDEM, -- Necessario para agrupada a viagem
		  MIN(ORDMAN) ORDMAN, -- Necessario para agrupada a viagem
		  --
		  codigoLinhaTrecho,
		  codigoLocalColeta,
          nomeLocalColeta,
          latitudeLocalColeta,
          longitudeLocalColeta,
          raioMetrosLocalColeta, 
		  dataColeta,
		  codigoLocalEntrega,
		  nomeLocalEntrega,
          latitudeLocalEntrega,
          longitudeLocalEntrega,
          raioMetrosLocalEntrega, 
		  dataEntrega
		FROM 
		(
		SELECT 
		  t.codigoFilialManifesto,
		  t.serieManifesto,
		  t.codigoManifesto,
		  t.placaVeiculo,
		  t.Veiculo,
		  t.codigoClassificacaoVeiculo,
		  t.placaVeiculo2,
		  t.Veiculo2,
		  t.codigoClassificacaoVeiculo2,
		  t.placaoVeiculo3,
		  t.Veiculo3,
		  t.codigoClassificacaoVeiculo3,
		  t.placaVeiculo4,
		  t.Veiculo4,
		  t.codigoClassificacaoVeiculo4,
		  t.placaVeiculo5,
		  t.Veiculo5,
		  t.codigoClassificacaoVeiculo5,
		  t.codigoMotorista1,
		  t.codigoMotorista2,
		  t.codigoTomador,
		  t.codigoLinha,
		  t.codigoFilialPedido,
		  t.ORDEM,
		  t.ORDMAN,
		  CASE WHEN (t.codigoTomador NOT IN (125,148,149,151,152,154,155,157)  -- Regra de Tomador, não é John Deere
				  OR (t.codigoTomador in (125,148,149,151,152,154,155,157)       -- Regra de Tomador é John Deere
					  AND ISNULL(t.codigoReferenciaCliente,' ') =  ' ')) THEN
					 cast(t.codigoPedido as varchar(10))
				  else
					 t.codigoReferenciaCliente -- Codigo agrupado do sistema Integrator
				  end numeroPedido,
		  --
		  t.codigoLinhaTrecho,
		  t.codigoLocalColeta,
		  CLIC.RAZSOC nomeLocalColeta,
          CLIC.LATITU latitudeLocalColeta,
          CLIC.LONGIT longitudeLocalColeta,
		  CLIC.RAIOMT raioMetrosLocalColeta,
		  t.dataColeta,
		  t.codigoLocalEntrega,
		  CLIE.RAZSOC nomeLocalEntrega,
          CLIE.LATITU latitudeLocalEntrega,
          CLIE.LONGIT longitudeLocalEntrega,
		  CLIE.RAIOMT raioMetrosLocalEntrega,
		  t.dataEntrega	
		  --
		FROM @VIAGENS_TEMP T
		INNER JOIN  RODCLI CLIC ON CLIC.CODCLIFOR = t.codigoLocalColeta
		INNER JOIN  RODCLI CLIE ON CLIE.CODCLIFOR = t.codigoLocalEntrega
		) VIA
		GROUP BY 
		  codigoFilialManifesto,
		  serieManifesto,
		  codigoManifesto,
		  placaVeiculo,
		  Veiculo,
		  codigoClassificacaoVeiculo,
		  placaVeiculo2,
		  Veiculo2,
		  codigoClassificacaoVeiculo2,
		  placaoVeiculo3,
		  Veiculo3,
		  codigoClassificacaoVeiculo3,
		  placaVeiculo4,
		  Veiculo4,
		  codigoClassificacaoVeiculo4,
		  placaVeiculo5,
		  Veiculo5,
		  codigoClassificacaoVeiculo5,
		  codigoMotorista1,
		  codigoMotorista2,
		  codigoTomador,
		  codigoLinha,
		  codigoLinhaTrecho,
		  codigoFilialPedido,
		  numeroPedido,
		  codigoLocalColeta,
          nomeLocalColeta,
          latitudeLocalColeta,
          longitudeLocalColeta,
		  raioMetrosLocalColeta,
		  dataColeta,
		  codigoLocalEntrega,
          nomeLocalEntrega,
          latitudeLocalEntrega,
          longitudeLocalEntrega,
          raioMetrosLocalEntrega,
		  dataEntrega
	    ) V;
	   --
       PRINT 'PI_GERA_LISTA_VIAGENS FIM   =>' + CONVERT(VARCHAR(30), GETDATE(), 114);
	   --
	   -- RETORNA AS VIAGENS
	   --
	   -- LISTANDO PARA CONEFERENCIA DO RESULTADO EM PRODUÇÃO COMENTAR
	   SELECT  * 
	   FROM @VIAGENS 
	   ORDER BY 
        codigoFilialManifesto,
        serieManifesto,
        codigoManifesto,
	    ORDEM,
	    ORDMAN;
	   --
	   RETURN 
	   SELECT * 
	   FROM @VIAGENS 
	   ORDER BY 
        codigoFilialManifesto,
        serieManifesto,
        codigoManifesto,
	    ORDEM,
	    ORDMAN;
	END;
	--
	--
	-- *********************
	-- Fim do processo...
	-- *********************
 END TRY
 --
 BEGIN CATCH
  --
  SELECT   
    ERROR_NUMBER() AS ErrorNumber,  
    ERROR_SEVERITY() AS ErrorSeverity,  
    ERROR_STATE() AS ErrorState,  
    ERROR_PROCEDURE() AS ErrorProcedure,  
    ERROR_MESSAGE() AS ErrorMessage,  
    ERROR_LINE() AS ErrorLine;
    --
    SET @RETORNO = @err_message + ' ERRO:' + ERROR_MESSAGE();
    PRINT 'PI_GERA_LISTA_VIAGENS FINALIZOU COM ERROS';
    RETURN;
 END CATCH;
 -- 
END
GO


