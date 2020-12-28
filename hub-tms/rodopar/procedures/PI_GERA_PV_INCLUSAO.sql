USE [db_visual_mirassol_teste]
GO

/****** Object:  StoredProcedure [dbo].[PI_GERA_PV_INCLUSAO]    Script Date: 29/06/2020 20:47:33 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- ====================================================
-- Create date: 11/03/2020
-- Description:	Criação da programação de veículo
-- Parametros de entrada: Codigo da filial do pedido,
-- numero do pedido (codigo da RODPRC), 
-- codigo do destino (considerando que pode ser N destino para uma PC),
-- codigo do motorista, placa(s) do veiculo(s) sendo a chave
-- tabela RODVEI e o usuario do Rodopar
-- 
-- Parametro de Saida: codigo da programação do veículo
-- =====================================================
CREATE PROCEDURE [dbo].[PI_GERA_PV_INCLUSAO]
                 @CODFIL smallint,
				 @CODIGO int,
				 @ORDCOM VARCHAR(30),
				 @CODDES int,
                 @CODMO1 smallint,
                 @CODMO2 smallint,
                 @PLACA  varchar(8),
                 @PLACA2 varchar(8),
                 @PLACA3 varchar(8),
                 @PLACA4 varchar(8),
				 @DATSAI smalldatetime,
                 @USUARIO varchar(20),
				 @CODLPR int output,
				 @RETORNO nvarchar(500) output
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET XACT_ABORT ON;
    DECLARE @CODPV INT,
	@err_message nvarchar(250);
	
    --
    -- ***************************************************************
	-- GRAVACAO DA PROGRAMAÇÃO DE VEICULO COM BASE EM INFORMAÇÕES
	-- DA PC-PROGRAMAÇÃO DE CARGA E INFORMAÇÕES RECEBIDO POR PARAMETRO
    -- ***************************************************************
	--
    BEGIN TRY
	        PRINT 'PI_GERA_PROGRAMACAO_VEICULO_INCLUSAO INICOU';
	        --
		    PRINT 'GRAVAR A TABELA RODLPR' + @err_message
  		    --
			--
			-- Recuperar a ultima programção de veiculo + 1
			--
			set @err_message = 'RECUPERANDO MAX CODLPR DA TABELA RODLPR';
			--
			SELECT @CODPV = MAX(ISNULL(PV.CODLPR,0))+1 
			FROM RODLPR PV WHERE PV.CODFIL=@CODFIL;
			--
			--
			-- GRAVACAO DA PROGRAMAÇÃO DE VEICULO
			--
			set @err_message = 'GRAVAR TABELA RODLPR';
			--
			INSERT INTO RODLPR
			(
			 CODLPR
			,CODFIL -- COLUNA 2
			,CODPAD -- COLUNA 3
			,PLACA -- COLUNA 4
			,PLACA2 -- COLUNA 5
			,PLACA3 -- COLUNA 6
			,CODMO1 -- COLUNA 7
			,CODMO2 -- COLUNA 8
			,CODLIN -- COLUNA 9
			,CODLOC -- COLUNA 10
			,CODTOM -- COLUNA 11
			,CODREM -- COLUNA 12
			,CODDES -- COLUNA 13
			,CODICO -- COLUNA 14
			,FILORI -- COLUNA 15
			,FILDES -- COLUNA 16
			,CODHOR -- COLUNA 17
			,FILPRC -- COLUNA 18
			,CODPRC -- COLUNA 19
			,DATSAI -- COLUNA 20
			,DATCHE -- COLUNA 21
			,OBSERV -- COLUNA 22
			,DIASEM -- COLUNA 23
			,SITUAC -- COLUNA 24
			,DATCAN -- COLUNA 25
			,DATCAD -- COLUNA 26
			,DATBAI -- COLUNA 27
			,VLRVIA -- COLUNA 28
			,PRECHE -- COLUNA 29
			,DATATU -- COLUNA 30
			,USUATU -- COLUNA 31
			,DATINC -- COLUNA 32
			,CONTAI -- COLUNA 33
			,NOMPOR -- COLUNA 34
			,FREETM -- COLUNA 35
			,PADCTN -- COLUNA 36
			,AGENAV -- COLUNA 37
			,NUMCTN -- COLUNA 38
			,DIGCTN -- COLUNA 39
			,COMCTN -- COLUNA 40
			,TARCTN -- COLUNA 41
			,REGIME -- COLUNA 42
			,LOCATR -- COLUNA 43
			,NOMNAV -- COLUNA 44
			,DOCEXP -- COLUNA 45
			,TIPCTN -- COLUNA 46
			,BRUCTN -- COLUNA 47
			,NUMLAC -- COLUNA 48
			,LACPRO -- COLUNA 49
			,TERCOL -- COLUNA 50
			,TERENT -- COLUNA 51
			,CODREG -- COLUNA 52
			,DISPON -- COLUNA 53
			,RESERV -- COLUNA 54
			,PLACA4 -- COLUNA 55
			,AEREO -- COLUNA 56
			,NUMEDI -- COLUNA 57
			,NUDTAE -- COLUNA 58
			,NUDTA1 -- COLUNA 59
			,NUDTAS -- COLUNA 60
			,NUMAWB -- COLUNA 61
			,NUHAWB -- COLUNA 62
			,USUINC -- COLUNA 63
			,CODRED -- COLUNA 64
			,CODPOR -- COLUNA 65
			,TIPCAL -- COLUNA 66
			,VALCAL -- COLUNA 67
			,NUMDOC -- COLUNA 68
			,ORDCOM -- COLUNA 69
			,ORDCO2 -- COLUNA 70
			,CODAUT -- COLUNA 71
			,USULIB -- COLUNA 72
			,DATLIB -- COLUNA 73
			,FREPES -- COLUNA 74
			,DESPAC -- COLUNA 75
			,TAREST -- COLUNA 76
			,VLRCAR -- COLUNA 77
			,VLRENT -- COLUNA 78
			,BASCAL -- COLUNA 79
			,VLRTOT -- COLUNA 80
			,FREVLR -- COLUNA 81
			,VLRSEG -- COLUNA 82
			,VLRITR -- COLUNA 83
			,VLRDES -- COLUNA 84
			,VLRADI -- COLUNA 85
			,ALIQUO -- COLUNA 86
			,SECCAT -- COLUNA 87
			,VLRADM -- COLUNA 88
			,VLRPED -- COLUNA 89
			,VLRCOL -- COLUNA 90
			,VLRICM -- COLUNA 91
			,DESADI -- COLUNA 92
			,AGECAR -- COLUNA 93
			,CODCIA -- COLUNA 94
			,ID_ENDENT -- COLUNA 95
			,ID_ENDCOL -- COLUNA 96
			,CODCIE -- COLUNA 97
			,IMPEXP -- COLUNA 98
			,CDTCHE -- COLUNA 99
			,CDTENT -- COLUNA 100
			,CDTSAI -- COLUNA 101
			,DDTCHE -- COLUNA 102
			,DDTENT -- COLUNA 103
			,DDTSAI -- COLUNA 104
			,CHKLTE -- COLUNA 105
			,CODUNI -- COLUNA 106
			,PORENT -- COLUNA 107
			,DIFERE -- COLUNA 108
			,LOGGER -- COLUNA 109
			,SITGER -- COLUNA 110
			,DATGER -- COLUNA 111
			,USUGER -- COLUNA 112
			,NUMINV -- COLUNA 113
			,NUMAGE -- COLUNA 114
			,TAXVAR -- COLUNA 115
			,NUMCTR -- COLUNA 116
			,FERROV -- COLUNA 117
			,CONRED -- COLUNA 118
			,REDMUN -- COLUNA 119
			,ITECOM -- COLUNA 120
			,VLRCTN -- COLUNA 121
			,TIPCON -- COLUNA 122
			,CODTAL -- COLUNA 123
			,NUMENT -- COLUNA 124
			,NUMCOL -- COLUNA 125
			,DESICM -- COLUNA 126
			,CODCST -- COLUNA 127
			,ALICOT_ST -- COLUNA 128
			,BASCAL_ST -- COLUNA 129
			,VLRICM_ST -- COLUNA 130
			,ID_ENDPAG -- COLUNA 131
			,FORPED -- COLUNA 132
			,NVAPED -- COLUNA 133
			,TVAPED -- COLUNA 134
			,CODMO3 -- COLUNA 135
			)
			-- SELECT INFORMAÇÕES DO PEDIDO (PC) + INFORMADA PELA TORRE
			SELECT
				@CODPV -- COLUNA 1
			   ,PRC.CODFIL -- COLUNA 2
			   ,PRC.CODPAD -- COLUNA 3
			   ,@PLACA -- COLUNA 4  PLACA INFORMADA NA TORRE
			   ,@PLACA2 -- COLUNA 5 PLACA2 INFORMADA NA TORRE
			   ,@PLACA3 -- COLUNA 6 PLACA3 INFORMADA NA TORRE
			   ,@CODMO1 -- COLUNA 7 MOTORISTA CODMO1 INFORMADA NA TORRE
			   ,@CODMO2 -- COLUNA 8 MOTORISTA CODMO2 INFORMADA NA TORRE
			   ,PRC.CODLIN -- COLUNA 9
			   ,NULL -- COLUNA 10
			   ,PRC.CODTOM -- COLUNA 11
			   ,PRC.CODREM -- COLUNA 12
			   ,@CODDES -- COLUNA 13 DESTINO RECUPERADO NA TABELA RODIPR
			   ,PRC.CODICO -- COLUNA 14
			   ,@CODFIL -- COLUNA 15 INFORMADO POR PARAMETRO
			   ,ISNULL(PRC.FILDES, @CODFIL) -- COLUNA 16
			   ,PRC.CODHOR -- COLUNA 17
			   ,NULL -- COLUNA 18
			   ,NULL -- COLUNA 19
			   ,NULL -- COLUNA 20
			   ,PRC.DATRET -- COLUNA 21
			   ,PRC.OBSERV -- COLUNA 22
			   ,NULL -- COLUNA 23
			   ,'D' -- COLUNA 24 -- STATUS PV COM ALOCAÇÃO
			   ,NULL -- COLUNA 25
			   ,GETDATE() -- COLUNA 26
			   ,NULL -- COLUNA 27
			   ,NULL -- COLUNA 28
			   ,PRC.DATENT -- COLUNA 29
			   ,GETDATE() -- COLUNA 30
			   ,@USUARIO + '(T)' -- COLUNA 31
			   ,GETDATE() -- COLUNA 32
			   ,PRC.CONTAI -- COLUNA 33
			   ,PRC.NOMPOR -- COLUNA 34
			   ,PRC.FREETM -- COLUNA 35
			   ,PRC.PADCTN -- COLUNA 36
			   ,PRC.AGENAV -- COLUNA 37
			   ,PRC.NUMCTN -- COLUNA 38
			   ,NULL -- COLUNA 39
			   ,PRC.COMCTN -- COLUNA 40
			   ,PRC.TARCTN -- COLUNA 41
			   ,PRC.REGIME -- COLUNA 42
			   ,PRC.LOCATR -- COLUNA 43
			   ,PRC.NOMNAV -- COLUNA 44
			   ,PRC.DOCEXP -- COLUNA 45
			   ,PRC.TIPCTN -- COLUNA 46
			   ,PRC.BRUCTN -- COLUNA 47
			   ,PRC.NUMLAC -- COLUNA 48
			   ,PRC.LACPRO -- COLUNA 49
			   ,PRC.TERCOL -- COLUNA 50
			   ,PRC.TERENT -- COLUNA 51
			   ,PRC.CODREG -- COLUNA 52
			   ,NULL -- COLUNA 53
			   ,PRC.RESERV -- COLUNA 54
			   ,@PLACA4 -- COLUNA 55 PLACA4 INFORMADA NA TORRE
			   ,PRC.AEREO -- COLUNA 56
			   ,PRC.NUMEDI -- COLUNA 57
			   ,PRC.NUDTAE -- COLUNA 58
			   ,PRC.NUDTA1 -- COLUNA 59
			   ,PRC.NUDTAS -- COLUNA 60
			   ,PRC.NUMAWB -- COLUNA 61
			   ,PRC.NUHAWB -- COLUNA 62
			   ,@USUARIO + '(T)' -- COLUNA 63
			   ,PRC.CODRED -- COLUNA 64
			   ,PRC.CODPOR -- COLUNA 65
			   ,PRC.TIPCAL -- COLUNA 66
			   ,PRC.VALCAL -- COLUNA 67
			   ,NULL -- COLUNA 68
			   ,@ORDCOM -- COLUNA 69 -- CODIGO DO AGRUPADOR (REF. DO CLIENTE)
			   ,NULL -- COLUNA 70
			   ,NULL -- COLUNA 71
			   ,NULL -- COLUNA 72
			   ,NULL -- COLUNA 73
			   ,PRC.FREPES -- COLUNA 74
			   ,PRC.DESPAC -- COLUNA 75
			   ,PRC.TAREST -- COLUNA 76
			   ,PRC.VLRCAR -- COLUNA 77
			   ,PRC.VLRENT -- COLUNA 78
			   ,PRC.BASCAL -- COLUNA 79
			   ,PRC.VLRTOT -- COLUNA 80
			   ,PRC.FREVLR -- COLUNA 81
			   ,PRC.VLRSEG -- COLUNA 82
			   ,PRC.VLRITR -- COLUNA 83
			   ,PRC.VLRDES -- COLUNA 84
			   ,PRC.VLRADI -- COLUNA 85
			   ,PRC.ALIQUO -- COLUNA 86
			   ,PRC.SECCAT -- COLUNA 87
			   ,PRC.VLRADM -- COLUNA 88
			   ,PRC.VLRPED -- COLUNA 89
			   ,PRC.VLRCOL -- COLUNA 90
			   ,PRC.VLRICM -- COLUNA 91
			   ,PRC.DESADI -- COLUNA 92
			   ,PRC.AGECAR -- COLUNA 93
			   ,PRC.CODCIA -- COLUNA 94
			   ,NULL -- COLUNA 95
			   ,PRC.ID_ENDCOL -- COLUNA 96
			   ,PRC.CODCIE -- COLUNA 97
			   ,PRC.IMPEXP -- COLUNA 98
			   ,NULL -- COLUNA 99
			   ,NULL -- COLUNA 100
			   ,NULL -- COLUNA 101
			   ,PRC.DATRET -- COLUNA 102
			   ,PRC.DATENT -- COLUNA 103
			   ,NULL -- COLUNA 104 -- NÃO INFORMAR PORQUE SERÁ DATA QUE SAIU DA MIRASSOL
			   ,NULL -- COLUNA 105
			   ,NULL -- COLUNA 106
			   ,PRC.PORENT -- COLUNA 107
			   ,PRC.DIFERE -- COLUNA 108
			   ,NULL -- COLUNA 109
			   ,NULL -- COLUNA 110
			   ,NULL -- COLUNA 111
			   ,NULL -- COLUNA 112
			   ,PRC.NUMINV -- COLUNA 113
			   ,PRC.NUMAGE -- COLUNA 114
			   ,NULL -- COLUNA 115
			   ,PRC.NUMCTR -- COLUNA 116
			   ,PRC.FERROV -- COLUNA 117
			   ,PRC.CONRED -- COLUNA 118
			   ,PRC.REDMUN -- COLUNA 119
			   ,NULL -- COLUNA 120
			   ,PRC.VLRCTN -- COLUNA 121
			   ,NULL -- COLUNA 122
			   ,PRC.CODTAL -- COLUNA 123
			   ,NULL -- COLUNA 124
			   ,NULL -- COLUNA 125
			   ,PRC.DESICM -- COLUNA 126
			   ,PRC.CODCST -- COLUNA 127
			   ,PRC.ALICOT_ST -- COLUNA 128
			   ,PRC.BASCAL_ST -- COLUNA 129
			   ,PRC.VLRICM_ST -- COLUNA 130
			   ,PRC.ID_ENDPAG -- COLUNA 131
			   ,NULL -- COLUNA 132
			   ,NULL -- COLUNA 133
			   ,NULL -- COLUNA 134
			   ,NULL -- COLUNA 135 MOTORISTA CODMO3 INEXISTE NA TORRE
			FROM RODPRC PRC
			WHERE PRC.CODFIL = @CODFIL
			  AND PRC.CODIGO = @CODIGO;	
			--
			-- GRAVACAO DA TABELA RODDPR PROGRAMAÇÃO DE VEICULO ASSOCIATIVA COM A PC
			--
			set @err_message = 'GRAVAR TABELA RODDPR';
			--
			INSERT INTO RODDPR 
			(       -- COLUNA 1 INCRIMENTO AUTOMATICO
			 TIPDOC -- COLUNA 2
			,TIPPRO -- COLUNA 3
			,CODDOC -- COLUNA 4
			,SERDOC -- COLUNA 5
			,FILDOC -- COLUNA 6
			,CODPRO -- COLUNA 7
			,FILPRO -- COLUNA 8
			,TEMP -- COLUNA 9
			,USUATU -- COLUNA 10
			,NOMEPC -- COLUNA 11
			,DATATU -- COLUNA 12
			,DATINC -- COLUNA 13
			,GRUPRO -- COLUNA 14
			,USUINC -- COLUNA 15
			)
			VALUES 
			( 
				 -- COLUNA 1 INCRIMENTO AUTOMATICO
			 'V' -- COLUNA 2
			,'C' -- COLUNA 3
			,@CODPV -- COLUNA 4 -- codigo da programação do veículo (PV)
			,NULL -- COLUNA 5
			,@CODFIL -- COLUNA 6 -- Codigo da filial 
			,@CODIGO -- COLUNA 7 -- Codigo do pedido (PC)
			,@CODFIL -- COLUNA 8
			,'N' -- COLUNA 9
			,@USUARIO + '(T)' -- COLUNA 10
			,'TORRE' -- COLUNA 11
			,GETDATE() -- COLUNA 12
			,GETDATE() -- COLUNA 13
			,NULL -- COLUNA 14
			,@USUARIO + '(T)' -- COLUNA 15
			);
			--
			-- GRAVA A TABELA RODILP (COMPOSICAO DE CARGA)
			--
			DECLARE @CODILP int,
                    @CODPROTR int,
					@NUMNOT varchar(20),
                    @SERIEN varchar(3),
                    @DATNOT smalldatetime,
					@QUANTI int,
                    @PESOKG decimal(12,4),
                    @VLRMER decimal(14,2),
                    @ESPECI varchar(20),
                    @CUBAGE char,
                    @LARGUR decimal(8,4),
                    @ALTURA decimal(8,4),
                    @PROFUN decimal(8,4),
                    @PESCUB decimal(16,6),
                    @PESCAL decimal(12,4),
                    @VMERSE decimal(14,2),
                    @EMPMAX smallint,
                    @NATURE varchar(40),
                    @ITECOM varchar(240),
                    @CODFIS smallint,
                    @NOTNFE varchar(50),
                    @NUMAWB varchar(60),
                    @NUHAWB varchar(60),
                    @TIPUNI char,
                    @IDEUNI varchar(20);
			--
			BEGIN
			--
			set @err_message = 'BSUCANDO O MAX ID_ILP TABELA RODILP';
			--
			SELECT 
				@CODILP = MAX(ISNULL(ILP.ID_ILP,0))  -- PROXIMO ID
			FROM RODILP ILP;
            --
			PRINT 'ID RECUPERADO:' + CAST(@CODILP AS VARCHAR(10));
			--
			-- Cursor para recuperar os destino
			--
			DECLARE DESTINOS CURSOR FOR
			SELECT 
				 IPR.CODPROTR -- COLUNA 4
				,IPR.SERIEN -- COLUNA 5
				,IPR.NUMNOT -- COLUNA 6
				,IPR.DATNOT -- COLUNA 7
				,ISNULL(IPR.QUANTI, 0) AS "QUANTI" -- COLUNA 8 OBS: PORQUE NO PEDIDO PERMITE NULO
				,IPR.PESOKG -- COLUNA 9
				,IPR.VLRMER -- COLUNA 10
				,IPR.ESPECI -- COLUNA 11
				,IPR.CUBAGE -- COLUNA 12
				,IPR.LARGUR -- COLUNA 13
				,IPR.ALTURA -- COLUNA 14
				,IPR.PROFUN -- COLUNA 15
				,IPR.PESCUB -- COLUNA 16
				,IPR.PESCAL -- COLUNA 17
				,IPR.VMERSE -- COLUNA 18
				,IPR.EMPMAX -- COLUNA 19
				,IPR.NATURE -- COLUNA 20
				,IPR.ITECOM -- COLUNA 22
				,IPR.CODFIS -- COLUNA 27
				,IPR.NOTNFE -- COLUNA 28
				,IPR.NUMAWB -- COLUNA 29
				,IPR.NUHAWB -- COLUNA 30
				,IPR.TIPUNI -- COLUNA 31
				,IPR.IDEUNI -- COLUNA 32
			FROM RODIPR IPR
			WHERE IPR.CODFIL = @CODFIL
				AND IPR.CODIGO = @CODIGO;

	        print 'ABRIR CURSOR';
	        SET @err_message = 'ABRIR CURSOR';
	        --
	        OPEN DESTINOS; 
 	        --
	        SET @err_message = 'FECH CURSOR';
	        --
	        print 'FETCH CURSOR';
	        FETCH NEXT FROM DESTINOS  
	        INTO @CODPROTR -- COLUNA 4
				,@SERIEN -- COLUNA 5
				,@NUMNOT -- COLUNA 6
				,@DATNOT -- COLUNA 7
				,@QUANTI -- COLUNA 8 OBS: PORQUE NO PEDIDO PERMITE NULO
				,@PESOKG -- COLUNA 9
				,@VLRMER -- COLUNA 10
				,@ESPECI -- COLUNA 11
				,@CUBAGE -- COLUNA 12
				,@LARGUR -- COLUNA 13
				,@ALTURA -- COLUNA 14
				,@PROFUN -- COLUNA 15
				,@PESCUB -- COLUNA 16
				,@PESCAL -- COLUNA 17
				,@VMERSE -- COLUNA 18
				,@EMPMAX -- COLUNA 19
				,@NATURE -- COLUNA 20
				,@ITECOM -- COLUNA 22
				,@CODFIS -- COLUNA 27
				,@NOTNFE -- COLUNA 28
				,@NUMAWB -- COLUNA 29
				,@NUHAWB -- COLUNA 30
				,@TIPUNI -- COLUNA 31
				,@IDEUNI; -- COLUNA 32
            --
	        WHILE @@FETCH_STATUS = 0 
			   --
			   BEGIN
			     SET @CODILP = @CODILP + 1;
			     --
			     -- GRAVA A TABELA RODILP (COMPOSICAO DE CARGA)
			     --
			     set @err_message = 'GRAVAR TABELA RODILP';
			     --
	             INSERT INTO RODILP
	      		 (
	      		 ID_ILP -- COLUNA 1
	      		,FILLPR -- COLUNA 2
	     		,CODLPR -- COLUNA 3
		    	,CODPROTR -- COLUNA 4
		    	,SERIEN -- COLUNA 5
	    		,NOTFIS -- COLUNA 6
		    	,DATNOT -- COLUNA 7
		    	,QUANTI -- COLUNA 8
		    	,PESOKG -- COLUNA 9
		    	,VLRMER -- COLUNA 10
		    	,ESPECI -- COLUNA 11
		    	,CUBAGE -- COLUNA 12
		    	,LARGUR -- COLUNA 13
		    	,ALTURA -- COLUNA 14
			    ,PROFUN -- COLUNA 15
			    ,PESCUB -- COLUNA 16
		    	,PESCAL -- COLUNA 17
		    	,VMERSE -- COLUNA 18
		    	,EMPMAX -- COLUNA 19
		      	,NATURE -- COLUNA 20
		    	,ORDCOM -- COLUNA 21
		     	,ITECOM -- COLUNA 22
			    ,SITUAC -- COLUNA 23
		    	,DATATU -- COLUNA 24
		    	,USUATU -- COLUNA 25
		    	,DATINC -- COLUNA 26
		    	,CODFIS -- COLUNA 27
		    	,NOTNFE -- COLUNA 28
		    	,NUMAWB -- COLUNA 29
		    	,NUHAWB -- COLUNA 30
		    	,TIPUNI -- COLUNA 31
		    	,IDEUNI -- COLUNA 32
			    ,USUINC -- COLUNA 33
			    )
			    VALUES
			    (@CODILP  -- COLUNA 1 ==> PROXIMO ID
				,@CODFIL -- COLUNA 2
				,@CODPV -- COLUNA 3
				,@CODPROTR -- COLUNA 4
				,@SERIEN -- COLUNA 5
				,@NUMNOT -- COLUNA 6
				,@DATNOT -- COLUNA 7
				,@QUANTI -- COLUNA 8 OBS: PORQUE NO PEDIDO PERMITE NULO
				,@PESOKG -- COLUNA 9
				,@VLRMER -- COLUNA 10
				,@ESPECI -- COLUNA 11
				,@CUBAGE -- COLUNA 12
				,@LARGUR -- COLUNA 13
				,@ALTURA -- COLUNA 14
				,@PROFUN -- COLUNA 15
				,@PESCUB -- COLUNA 16
				,@PESCAL -- COLUNA 17
				,@VMERSE -- COLUNA 18
				,@EMPMAX -- COLUNA 19
				,@NATURE -- COLUNA 20
				,@ORDCOM -- COLUNA 21
				,@ITECOM -- COLUNA 22
				,'D' -- COLUNA 23
				,GETDATE() -- COLUNA 24
				,@USUARIO + '(T)' -- COLUNA 25
				,GETDATE() -- COLUNA 26
				,@CODFIS -- COLUNA 27
				,@NOTNFE -- COLUNA 28
				,@NUMAWB -- COLUNA 29
				,@NUHAWB -- COLUNA 30
				,@TIPUNI -- COLUNA 31
				,@IDEUNI -- COLUNA 32
				,@USUARIO  + '(T)'-- COLUNA 33
				);
 	            --
	            SET @err_message = 'FECH CURSOR';
			    print 'FETCH NEXT DESTINO/PRODUTO';
			    --
	            FETCH NEXT FROM DESTINOS  
	            INTO @CODPROTR -- COLUNA 4
			    	,@SERIEN -- COLUNA 5
			    	,@NUMNOT -- COLUNA 6
			    	,@DATNOT -- COLUNA 7
			    	,@QUANTI -- COLUNA 8 OBS: PORQUE NO PEDIDO PERMITE NULO
			    	,@PESOKG -- COLUNA 9
			    	,@VLRMER -- COLUNA 10
			    	,@ESPECI -- COLUNA 11
			    	,@CUBAGE -- COLUNA 12
			    	,@LARGUR -- COLUNA 13
			    	,@ALTURA -- COLUNA 14
			    	,@PROFUN -- COLUNA 15
			    	,@PESCUB -- COLUNA 16
			    	,@PESCAL -- COLUNA 17
			    	,@VMERSE -- COLUNA 18
			    	,@EMPMAX -- COLUNA 19
			    	,@NATURE -- COLUNA 20
			    	,@ITECOM -- COLUNA 22
			    	,@CODFIS -- COLUNA 27
			    	,@NOTNFE -- COLUNA 28
			    	,@NUMAWB -- COLUNA 29
			    	,@NUHAWB -- COLUNA 30
			    	,@TIPUNI -- COLUNA 31
			    	,@IDEUNI; -- COLUNA 32
				END;
			END
			--
	        SET @err_message = 'CLOSE CURSOR DESTINOS';
	        --
	        print 'CLOSE CURSOS DESTINOS';
	         --
	        CLOSE DESTINOS;  
	        DEALLOCATE DESTINOS;
			--
			-- Atualizar o status da PC para baixad
			-- Após a criação da PV
			--
			set @err_message = 'ATUALIZAR STATUS DA PC PARA BAIXADO TABELA RODPRC';
			--
			UPDATE RODPRC 
			SET SITUAC = 'B',
				DATATU = GETDATE(),
				USUATU = @USUARIO + '(T)'
			WHERE CODFIL = @CODFIL
			AND CODIGO = @CODIGO;
			--
			-- Atualizar o status da composição de carga da PC para baixado
			-- Após a criação da PV
			--
			set @err_message = 'ATUALIZAR STATUS DA PC-Composição de carga PARA BAIXADO TABELA RODPRC';
			--
			UPDATE RODIPR
			SET SITUAC = 'B',
				DATATU = GETDATE(),
				USUATU = @USUARIO + '(T)'
			WHERE CODFIL = @CODFIL
			AND CODIGO = @CODIGO;
			--
	        --
		    PRINT 'GRAVOU TODAS AS TABELAS DA PV COM SUCESSO';
		    --
		    -- GRAVOU TODAS AS TABELAS DA PV COM SUCESSO
		    --
		    SET @CODLPR = @CODPV;
		    SET @RETORNO = 'OK';
	        PRINT 'PI_GERA_PROGRAMACAO_VEICULO_INCLUSAO FINALIZOU COM SUCESSO';
		    RETURN;
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
	     SET @CODLPR = -1;
	     SET @RETORNO = @err_message + ' ERRO:' + ERROR_MESSAGE();
	     PRINT 'PI_GERA_PROGRAMACAO_VEICULO_INCLUSAO FINALIZOU COM ERROS';
	     RETURN;
	   END CATCH;
	   
END
GO


