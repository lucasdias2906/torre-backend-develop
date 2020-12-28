USE [db_visual_mirassol_teste]
GO

/****** Object:  StoredProcedure [dbo].[PI_GERA_PV_ATUALIZACAO]    Script Date: 29/06/2020 20:46:45 ******/
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
CREATE PROCEDURE [dbo].[PI_GERA_PV_ATUALIZACAO]
                 @CODFIL smallint,
				 @CODIGO int,
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
    DECLARE @err_message nvarchar(250);
	
    -- ******************************************************
	-- Verificar se foram informados os parameros de entrada
	-- obrigatórios para criação da programação de veóculo
    -- ******************************************************
	--
	PRINT 'PI_GERA_PROGRAMACAO_VEICULO_ATUALIZACAO INICOU';
	--
	BEGIN TRY
	--
    BEGIN 
	  SET @err_message = (SELECT
	    CASE WHEN ISNULL(@CODFIL,0) <= 0 THEN 'INFORMAR CODIGO DA FILIAL'
	         WHEN ISNULL(@CODIGO,0) <= 0 THEN 'INFORMAR CODIGO DO PEDIDO'
             WHEN ISNULL(@CODMO1,0) <= 0 THEN 'INFORMAR CODIGO DO MOTORISTA'
             WHEN ISNULL(@PLACA,' ') = ' ' THEN 'INFORMAR PLACA DO VEICULO'
			 WHEN ISNULL(@USUARIO, ' ') = ' ' THEN 'INFORMAR O CODIGO DO USUARIO'
	   END AS MENSAGEM)
	END;

	IF @err_message <> ' '
       BEGIN
	       RAISERROR (@err_message, 11,1)
	   END;
	   --
	END TRY
	BEGIN CATCH
		 print 'erros de parametros';
	   SET @CODLPR = -1;
	   SET @RETORNO = @err_message;
	    PRINT 'PI_GERA_PROGRAMACAO_VEICULO_ATUALIZACAO COM ERROS DE PARAMETROS';
	   RETURN;
	END CATCH
    -- ***************************************************************
	-- Recuperar informações da programação de carga (RODPRC)
	-- com base na filial e codigo do pedido informado por parametro
	-- a fim de verificar o status do pedido se não esta baixao e/ou cancelado
    -- ***************************************************************
    DECLARE @SITUAC_PC char;
	--
	BEGIN TRY
		PRINT 'CHECANDO O PEDIDO'
         --
		SELECT
		   @SITUAC_PC = max(PRC.SITUAC)
		FROM RODPRC PRC
		WHERE PRC.CODFIL = @CODFIL
		AND PRC.CODIGO = @CODIGO;
        --
		SET @err_message = (SELECT
							CASE WHEN ISNULL(@SITUAC_PC,'X') = 'X' THEN 'PEDIDO INEXISTENTE'
								 --WHEN ISNULL(@SITUAC_PC,'X') NOT IN ('D', 'M')  THEN 'PC NÃO ESTA COM STATUS DE CADASTRADA/MOVIMENTADA STATUS=' + @SITUAC_PC
								 WHEN ISNULL(@SITUAC_PC,'X') IN ('D', 'M')  THEN 'OK'
							END AS MENSAGEM)
	   --
	    IF @err_message <> 'OK'
		   BEGIN
	 	     print 'DESVIO ERRO DE PEDIDOS'
	         RAISERROR (@err_message, 11,1);
		   END;
		ELSE
		   PRINT 'PEDIDO OK';  
		--
	END TRY
	BEGIN CATCH
	   SET @CODLPR = -1;
	   SET @RETORNO = @err_message;
	   PRINT 'PI_GERA_PROGRAMACAO_VEICULO_ATUALIZACAO COM ERROS DE REGRAS DE PC';
	   RETURN;
	END CATCH
	--
	-- VERIFICAR SE JÁ EXISTE PV GRAVADA
	-- REFERENTE A PC-PROGRAMAÇÃO DE ENTRADA  INFORMADA
	--
	BEGIN TRY
		--
        DECLARE @SITUACPV char,
		        @CODPV INT;
		--
        -- Verifica na associativa se existe a PV associada a PV
        SELECT 
            @CODPV = MAX(DPR.CODDOC),
			@SITUACPV = MAX(LPR.SITUAC)
        FROM RODDPR DPR 
		INNER JOIN RODLPR LPR ON LPR.CODFIL = DPR.FILDOC 
		                     AND LPR.CODLPR = DPR.CODDOC
        WHERE DPR.TIPDOC = 'V' 
          AND DPR.TIPPRO = 'C' 
          AND DPR.FILPRO = @CODFIL
          AND DPR.CODPRO = @CODIGO;
        --
		SET @err_message = (SELECT
							CASE WHEN ISNULL(@SITUACPV, 'X') = 'X' -- PV INEXISTENTE (ALOCAÇÃO)
							      AND ISNULL(@SITUAC_PC,'X') NOT IN ('D', 'M')  THEN 'PC NÃO ESTA COM STATUS DE CADASTRADA/MOVIMENTADA STATUS=' + @SITUAC_PC 
							     WHEN ISNULL(@SITUACPV, 'X') = 'X' THEN 'PV INEXISTENTE'
								 WHEN ISNULL(@SITUACPV, 'X') NOT IN ('D', 'M')  THEN 'PV NÃO ESTA COM STATUS DE CADASTRADA/MOVIMENTADA'
								 WHEN ISNULL(@SITUACPV, 'X') IN ('D', 'M')  THEN 'OK ATUALIZAR PV'
							END AS MENSAGEM)
	   --
	   IF @err_message NOT LIKE 'OK%'
		   BEGIN
	 	     print 'DESVIO ERRO DE PV'
	         RAISERROR (@err_message, 11,1);
		   END;
	   ELSE
		   PRINT @err_message;
		--
	END TRY
	BEGIN CATCH
	   SET @CODLPR = -1;
	   SET @RETORNO = @err_message;
	    PRINT 'PI_GERA_PROGRAMACAO_VEICULO_ATUALIZACAO COM ERROS DE REGRAS';
	   RETURN;
	END CATCH
    --
    -- ***************************************************************
	-- ATUALIZAÇÃO DA PROGRAMAÇÃO DE VEICULO COM BASE EM INFORMAÇÕES
	-- DA PC-PROGRAMAÇÃO DE CARGA E INFORMAÇÕES RECEBIDO POR PARAMETRO
    -- ***************************************************************
	--
	PRINT 'ATUALIZAR A TABELA RODLPR' + @err_message
    --
	--
	BEGIN TRY
     	--
		UPDATE RODLPR
		SET PLACA = @PLACA -- COLUNA 4  PLACA INFORMADA NA TORRE
			,PLACA2 = @PLACA2 -- COLUNA 5 PLACA2 INFORMADA NA TORRE
			,PLACA3 = @PLACA3 -- COLUNA 6 PLACA3 INFORMADA NA TORRE
			,PLACA4 = @PLACA4 -- COLUNA 55 PLACA4 INFORMADA NA TORRE
			,CODMO1 = @CODMO1 -- COLUNA 7 MOTORISTA CODMO1 INFORMADA NA TORRE
			,CODMO2 = @CODMO2 -- COLUNA 8 MOTORISTA CODMO2 INFORMADA NA TORRE
			,DATSAI = @DATSAI -- COLUNA 20 DATA DA SAIDA INFORMADA NA TORRE
			,USUATU = @USUARIO + '(T)' -- COLUNA 31
			,DATATU = GETDATE() -- COLUNA 32
		WHERE CODFIL = @CODFIL
		  AND CODLPR = @CODPV;
	    --
		PRINT 'GRAVOU TODAS AS TABELAS DA PV COM SUCESSO';
		--
		-- GRAVOU TODAS AS TABELAS DA PV COM SUCESSO
		--
		SET @CODLPR = @CODPV;
		SET @RETORNO = 'OK';
	    --
	    PRINT 'PI_GERA_PROGRAMACAO_VEICULO_ATUALIZACAO COM SUCESSO';
	    --
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
	    PRINT 'PI_GERA_PROGRAMACAO_VEICULO_ATUALIZACAO COM ERROS';
	    RETURN;
	END CATCH;
	
END
GO


