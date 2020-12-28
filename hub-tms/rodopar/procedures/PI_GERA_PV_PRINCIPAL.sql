USE [db_visual_mirassol_teste]
GO

/****** Object:  StoredProcedure [dbo].[PI_GERA_PV_PRINCIPAL]    Script Date: 29/06/2020 20:50:23 ******/
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
CREATE PROCEDURE [dbo].[PI_GERA_PV_PRINCIPAL]
                 @CODFIL smallint,
				 @CODIGO VARCHAR(30),
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
    print 'PI_GERA_PROGRAMACAO_VEICULO_PC_PRINCIPAL iniciou';
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET XACT_ABORT ON;
	
    -- ******************************************************
	-- Verificar se foram informados os parameros de entrada
	-- obrigatórios para criação da programação de veóculo
    -- ******************************************************
	BEGIN TRY
	--
	DECLARE @err_message nvarchar(250),
	        @SITUACMOT varchar(1);
	--
    BEGIN 
	  SET @err_message = (SELECT
	    CASE WHEN ISNULL(@CODFIL,0) <= 0 THEN 'INFORMAR CODIGO DA FILIAL PARA O PROCESSO DE GRAVAR PV'
	         WHEN ISNULL(@CODIGO,' ') = ' ' THEN 'INFORMAR CODIGO DO PEDIDO PARA O PROCESSO DE GRAVAR PV'
             WHEN ISNULL(@CODMO1,0) <= 0 THEN 'INFORMAR CODIGO DO MOTORISTA PARA O PROCESSO DE GRAVAR PV'
             WHEN ISNULL(@CODMO2,0) < 0 THEN 'INFORMAR CODIGO DO MOTORISTA 2 PARA O PROCESSO DE GRAVAR PV'
             WHEN ISNULL(@PLACA,' ') = ' ' THEN 'INFORMAR PLACA DO VEICULO PARA O PROCESSO DE GRAVAR PV'
			 WHEN ISNULL(@USUARIO, ' ') = ' ' THEN 'INFORMAR O CODIGO DO USUARIO PARA O PROCESSO DE GRAVAR PV'
	   END AS MENSAGEM)
	   --
	   print @err_message;
	   IF @err_message <> ' '
          BEGIN
	       RAISERROR (@err_message, 11,1)
	      END;
	END;
	--
	-- Verificar se o motorista 1 informado existe no cadastro (Sem FK na tabela RODLPR PV)
	--
	BEGIN
	  SELECT
	    @SITUACMOT = MOT.SITUAC
	  FROM RODMOT MOT
	  WHERE MOT.CODMOT = @CODMO1;
	  --
	  SET @err_message = (SELECT
	    CASE WHEN ISNULL(@SITUACMOT,'X') = 'X' THEN 'MOTORISTA 1 INFORMADO INEXISTENTE'
	         WHEN ISNULL(@SITUACMOT,'X') <> 'A' THEN 'MOTORISTA 1 INFORMADO INATIVO'
	   END AS MENSAGEM)
	   --
	   print @err_message;
	   IF @err_message <> ' '
          BEGIN
	       RAISERROR (@err_message, 11,1)
	      END;    
    END;
    --
	END TRY
	BEGIN CATCH
	   print 'erros de parametros';
	   SET @CODLPR = -1;
	   SET @RETORNO = @err_message;
	   RETURN;
	END CATCH
    -- ***************************************************************
	-- Recuperar informações da programação de carga (RODPRC)
	-- com base na filial e codigo do pedido informado por parametro
	-- a fim de verificar o status do pedido se não esta baixao e/ou cancelado
    -- ***************************************************************
    DECLARE @PC INT,
		    @PV INT,
	        @QTDPC_AGRUPADA smallint,
			@RET VARCHAR(500);
	--
	BEGIN TRY
	    --
	    -- Verificação se trata-se de pedidos agrupados da JOHN_DEERE??
	    -- Tratativa diferente para alocação dos veiculos com mais de uma PC
	    --
	    SET @err_message = 'VERIFICANDO SE PEDIDO AGRUPADO';
	    --
	    SELECT
	       @QTDPC_AGRUPADA =  COUNT(*)
	    FROM
	       (SELECT
	    		 DISTINCT PRC.CODIGO -- IPR PODE POSSUIR N DESTINO/PRODUTOS
	       FROM RODIPR IPR
	       INNER JOIN RODPRC PRC ON PRC.CODFIL = IPR.CODFIL
	                            AND PRC.CODIGO = IPR.CODIGO
           WHERE IPR.CODFIL = @CODFIL
	         AND ISNULL(IPR.ORDCOM,'x') = @CODIGO -- Código Agrupador informado
	         AND PRC.CODTOM IN (125,148,149,151,152,154,155,157) -- TOMADOR JOHN DEERER
        ) R;
        --
		-- CASO NÃO FOR PEDIDO AGRUPADO DA JOHN DEERE
		--
		PRINT 'QTD PCS AGRUPADA: ' +  CAST(ISNULL(@QTDPC_AGRUPADA,0) AS VARCHAR(10));
		PRINT 'CODIGO NUMERICO:' + CAST(ISNUMERIC(@CODIGO) AS VARCHAR(2));
		--
	    BEGIN TRANSACTION
		IF ISNULL(@QTDPC_AGRUPADA,0) = 0 AND
		   ISNUMERIC(@CODIGO) = 1 
     		--
			-- CHAMAR O PROCESSO DE PC NÃO AGRUPADA
			--
			BEGIN
		    SET @err_message = 'PI_GERA_PROGRAMACAO_VEICULO_PC_NAO_AGRUPADA';
			SET @PC = CAST(@CODIGO AS INT);
			EXEC dbo.PI_GERA_PV_PC_NAO_AGRUPADA 
				@CODFIL,
				@PC, -- TRANSFORMANDO PARAMETRO PARA NUMERICO
				NULL, -- CAMPO RESERVADO QUANDO FOR PC AGRUPADA
				@CODMO1,
				@CODMO2,
				@PLACA,
				@PLACA2,
				@PLACA3,
				@PLACA4,
				@DATSAI,
				@USUARIO,
				@CODLPR = @PV OUTPUT,
				@RETORNO = @RET OUTPUT;
		    END;
		ELSE
		    BEGIN
		    SET @err_message = 'PI_GERA_PROGRAMACAO_VEICULO_PC_AGRUPADA';
			EXEC dbo.PI_GERA_PV_PC_AGRUPADA 
				@CODFIL,
				@CODIGO, -- IFORMAR CODIGO AGRUPADOR
				@CODMO1,
				@CODMO2,
				@PLACA,
				@PLACA2,
				@PLACA3,
				@PLACA4,
				@DATSAI,
				@USUARIO,
		 		@CODLPR = @PV OUTPUT,
				@RETORNO = @RET OUTPUT
			END;
		--
		-- Retorno ao chamador
		SET @CODLPR = (SELECT @PV);
		SET @RETORNO = (SELECT @RET);
		--
		-- TRATATIVA DE ERROS NAS TRANSACOES REALIZDAS
		--
		IF @CODLPR <> -1 -- OCORRERAM ERROS NA GRAVACAO ???
		   BEGIN
             print 'PI_GERA_PROGRAMACAO_VEICULO_PC_PRINCIPAL finalizou com sucesso';
		     COMMIT TRANSACTION;
		     RETURN;
		   END;
	    ELSE -- OCORRERAM ERROS NA GRAVACAO DESFAZER TUDO
		   BEGIN
             print 'PI_GERA_PROGRAMACAO_VEICULO_PC_PRINCIPAL finalizou com erros';
		     ROLLBACK;
		     RETURN;
		   END;
		--
	END TRY
	BEGIN CATCH
        SELECT   
        ERROR_NUMBER() AS ErrorNumber,  
        ERROR_SEVERITY() AS ErrorSeverity,  
        ERROR_STATE() AS ErrorState,  
        ERROR_PROCEDURE() AS ErrorProcedure,  
        ERROR_MESSAGE() AS ErrorMessage,  
        ERROR_LINE() AS ErrorLine;
	    SET @CODLPR = -1;
	    SET @RETORNO = @err_message + ERROR_MESSAGE();
	    RETURN;
	END CATCH
	
END
GO


