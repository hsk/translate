- 3 Type index language

	[](
	We are to enrich λpat with a restricted form of dependent types.
	The enrichment is to parameterize over a type index language from which type index terms are drawn.
	)

	我々は、依存型の制限された形でλpatを強化します。
	強化事項は、記述された型インデックス項から型インデックス言語上でパラメータ化することです。

		------------------------------------(reg-true)
		φ; P~ |= true
		
		------------------------------------(reg-false)
		φ; P~ , false |= P
		
		φ; P~ |= P0
		------------------------------------(reg-var-thin)
		φ, a : s; P~ |= P0
		
		φ |- P : bool φ; P~ |= P0
		------------------------------------(reg-prop-thin)
		φ; P~ , P |= P0
		
		φ, a : s; P~ |= P φ |- I : s
		------------------------------------(reg-subst)
		φ; P~ [a 7→ I] |= P[a 7→ I]
		
		φ; P~ |= P0 φ; P~ , P0 |= P1
		------------------------------------(reg-cut)
		φ; P~ |= P1
		
		φ |- I : s
		------------------------------------(reg-eq-refl)
		φ; P~ |= I .=s I
		
		φ;P~ |= I1 .=s I2
		------------------------------------(reg-eq-symm)
		φ;P~ |= I2 .=s I1

		φ; P~ |= I1 .=s I2 φ; P~ |= I2.=s I3
		------------------------------------(reg-eq-tran)
		φ; P~ |= I1 .=s I3

	[](Fig. 9. The regularity rules)
	図9. 正則ルール

	[](
	In this section, we show how a generic type index language L can be formed and then present some concrete examples of type index languages. 
	For generality, we will include both tuples and functions in L.
	However, we emphasize that a type index language can but does not necessarily have to support tuples or functions.
	)

	このセクションでは、ジェネリック型のインデックス言語Lが形成され、次いでタイプインデックス言語のいくつかの具体的な例を提示する方法を示しています。
	一般性のために、我々は、Lの両方のタプルや機能が含まれます。
	しかし、我々はタイプインデックス言語は必ずしもタプルや機能をサポートする必要がないことを強調している。

	----

	[](
	The generic type index language L itself is typed.
	In order to avoid potential confusion, we call the types in L type index sorts (or sorts, for short).
	)

	ジェネリック型のインデックス言語L自体が型付けされている。
	混乱を避けるために、我々は、Lタイプインデックスソート(略して、またはソート)内の型を呼び出す。

	fig 7.

		b: base sorts. bool or ...
		C: constant sort = c-sort = (s1, . . ., sn) -> b 

	We use a for index variables and C for constants, which are either constant functions or constant constructors.

	我々はインデックス変数か、Cの生成ための定数関数や定数コンストラクタを使用します。

	Each constant is assigned a constant sort (or c-sort, for short) of the form (s1, . . . , sn) ⇒ b, which means that C(I1, . . . , In) is an index term of sort b if Ii are of sorts si for i = 1, . . . , n.


	インスタンス

	For instance, true and false are assigned the c-sort () ⇒ bool. We may write C for C() if C is a constant of c-sort () ⇒ b for some base sort b.

	シグニチャS

	We assume that the c-sorts of constants are declared in some signature S associated with L, and for each sort s, there is a constant function .=s of the c-sort (s, s) ⇒ bool.

	.=

	We may use .= to mean .=s for some sort s if there is no risk of confusion.

	Fig 8.

	----

	We present the sorting rules for type index terms in Figure 8, which are mostly standard.

	我々は、ほとんどが標準的である図8のタイプインデックスの用語、のソートルールを提示する。

	We use P for index propositions, which are index terms that can be assigned the sort bool (under some index context φ), and P~ for a sequence of propositions, where the ordering of the terms in this sequence is of no significance.

	我々は、このシーケンスの条件の順序は重要ではない命題のシーケンスのために（いくつかの指標のコンテキストφ下）ソートBOOLを割り当てることができますインデックス用語であるインデックス命題、およびP〜のためにPを使用しています。

	----

	[](
	We may write φ |- P~ : bool to mean that φ |- P : bool is derivable for every P in P~.
	In addition, we may use φ |- Θ : φ0 to indicate that φ |- Θ(a) : φ0(a) holds for each a in dom(Θ) = dom(φ0).
	)

	BOOLがP内のすべてのP〜のために誘導可能である：P - |それはφ意味するBOOL：P〜 - |我々は、φを書き込むことができる。
	また、我々はφを使用することがあります| - Θ：φ0はそれがφを示すために| - Θ（A）：φ0（a）の各AのDOM（Θ）= DOM（φ0）についても同様である。


