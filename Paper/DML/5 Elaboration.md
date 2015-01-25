- 5 Elaboration
- 5 推敲

	We have so far presented an explicitly typed language λΠ,Σ pat .
	This presentation has a serious drawback from the point of view of a programmer:
	One may quickly be overwhelmed with the need for writing types when programming in such a setting.
	It then becomes apparent that it is necessary to provide an external language DML0 together with a mapping from DML0 to the internal language λΠ,Σ pat , and we call such a mapping elaboration.
	We may also use the phrase type-checking loosely to mean elaboration, sometimes.

	我々はこれまでに、明示的に型付けされた言語 `λΠ,Σ pat` を示してきました。
	これまで示した物は、プログラマの観点から重大な欠点があります：
	一つは、すぐにそのような環境でプログラミングするには、多くの型を書く必要性に圧倒されるかもしれません。

	次にそれはλΠΣpat内部言語にDML0のマッピングとともに外部言語DML0を提供することが必要であることが明らかになり、私たちはこのようなマッピング推敲を呼び出します。

	また、時には、推敲を意味する緩いフレーズ型チェックを使用することもできます。

	----

	We are to introduce a set of rules to perform elaboration.
	The elaboration process itself is nondeterministic.
	Nonetheless, we can guarantee based on Theorem 5.3 that if e in DML0 can be elaborated into e in λΠ,Σ pat , then e and e are operationally equivalent.
	In other words, elaboration cannot alter the dynamic semantics of a program.
	This is what we call the soundness of elaboration, which is considered a major contribution of the paper.

	We are to perform elaboration with bi-directional strategy that casually resembles the one adopted by Pierce and Turner in their study on local type inference (Pierce & Turner, 1998), where the primary focus is on the interaction between polymorphism and subtyping.

	我々は、推敲を実行するために一連の規則を導入します。
	推敲プロセス自体は非決定的です。
	それにもかかわらず、我々は `DML0` 内の `e` を `λΠ, Σ pat` 内の `e` に推敲することができれば、`E` と `e` は操作上同等であることを定理5.3に基づいて保証することができます。
	言い換えれば、推敲は、プログラムの動的な意味論を変更することはできません。
	これは、論文の主要な貢献を考えている推敲の健全性と呼んでいます。
	ピアースとターナーによって採択された主な焦点が多相性とサブタイプの間の相互作用であるローカル型推論(Pierce & Turner, 1998)を、我々はカジュアルに彼らの研究のいずれかのような双方向の戦略に推敲を実行します。

	----

	We present the syntax for DML0 in Figure 20, which is rather similar to that of λΠ,Σ pat .
	In general, it should not be difficult to relate the concrete syntax used in our program examples to the formal syntax of DML0.
	We now briefly explain as to how some concrete syntax can be used to provide type annotations for functions.
	We essentially support two forms of type annotations for functions, both of which are given below:
	
	我々は `λΠ, Σ pat` のものとかなり類似している図20に `DML0` の構文を示します。
	一般的には、 `DML0` の正式な構文に我々のプログラム例で使用される具体的な構文を関連付けることは困難であってはなりません。
	現在、簡単にいくつかの具体的な構文は、関数に対して型注釈を提供するために使用することができる方法を説明します。
	我々は、基本的に以下に示す関数のように2つの型注釈の形式をサポートしています。

		fun succ1 (x) = x + 1
		withtype {a:int | a >= 0} int (a) -> int (a+1)

		fun succ2 {a:int | a >= 0} (x: int(a)): int(a+1) = x + 1

	The first form of annotation allows the programmer to easily read out the type of the annotated function while the second form makes it more convenient to handle a case where the body of a function needs to access some bound type index variables in the type annotation.

	注釈の最初の形式は、プログラマが簡単に注釈付きの関数の型を読み出すことを可能にし、
	2番目の形式は、それをより便利に同時に関数の本体は、型注釈にいくつかのバウンドタイプインデックス変数にアクセスする必要がある場合に対処することができます。

	The concrete syntax for the definition of succ1 translates into the following formal syntax,


	succ1の定義のための具体的な構文は以下の正式な構文に変換し、

		fix f : τ. λa : sˆ. lam x : int(a).(x + 1 : int(a + 1))

	where sˆ = {a : int | a ≥ 0}, and so does the concrete syntax for the definition of succ2.
	As an example, both forms of annotation are involved in the following program, which computes the length of a given list:

	ここで、 `sˆ = {a : int | a ≥ 0}` 、など `succ2` の定義のための具体的な構文を行います。
	例として、注釈の両方の形式が、与えられたリストの長さを計算する、次のプログラムに関与しています：

		fun length {n:nat} (xs: ’a list n): int n =
			let // this is a tail-recursive implementation
				fun aux xs j = case xs of
				| nil => j
				| cons (_, xs) => aux xs (j+1)
				withtype {i:nat, j:nat | i+j=n} ’a list i -> int j -> int n
			in
				aux xs 0
			end

	Note that the type index variable n is used in the type annotation for the inner auxiliary function aux .

	型インデックス変数 `n` が内側の補助関数 `aux` の型注釈で使用されていることに注意してください。


	----

	In the following presentation, we may use ⊃ + n (·) for ⊃ +(...(⊃ +(·))...), where there are n occurrences of ⊃ +, and ∧n(·) for ∧(...(∧(·))...), where there are n occurrences of ∧, and let Σ(∧0(x)) = e1 in e2 end for let Σ(x) = e1 in e2 end, and let Σ(∧n+1(x)) = e1 in e2 end for the following expression: let Σ(∧n(x)) = (let ∧ (x) = e1 in x end) in e2 end, where n ranges over natural numbers.


	以下に示すように、 `⊃ +(...(⊃ +(·))...)` のために `⊃ + n (·)` を使用することができます。ここで
	`∧(...(∧(·))...)`で`⊃+`か`∧n(·)`がn回の出現があり、
	∧か`let Σ(x) = e1 in e2 end`のために`let Σ(∧0(x)) = e1 in e2 end`か`let Σ(∧n(x)) = (let ∧ (x) = e1 in x end) in e2 end` のための `let Σ(∧n+1(x)) = e1 in e2` が出現がn回あり、nは自然数です。

		φ; P~ |= I1.= I'1 ··· φ; P~ |= In.= I'n
		---------------------------------------------------------------------(dy-sub-base)
		φ;P~ |- [] : δ(I1, ..., In) ≤ δ(I'1, ..., I'n)

		---------------------------------------------------------------------(dy-sub-unit)
		φ; P~ |- [] : 1 ≤ 1

		φ; P~ ; x1 : τ1, x2 : τ2 |- hx1, x2i ↓ τ ⇒ e
		---------------------------------------------------------------------(dy-sub-prod)
		φ;P~ |- let hx1, x2i = [] in e end : τ1 ∗ τ2 ≤ τ

		φ;P~ ; x : τ, x1 : τ1 |- x(x1) ↓ τ2 ⇒ e
		---------------------------------------------------------------------(dy-sub-fun)
		φ; P~ |- let x = [] in lamx1. e end : τ ≤ τ1 → τ2

		sˆ = {a : s | P1, ..., Pn} φ, a : s; P~ , P1, ..., Pn |- E : τ ≤ τ'
		---------------------------------------------------------------------(dy-sub-Π-r)
		φ; P~ |- Π+(⊃+ n (E)) : τ ≤ Πa:sˆ. τ'

		sˆ = {a : s | P1, ..., Pn} φ, a : s; P~ , P1, ..., Pn |- E : τ ≤ τ'
		---------------------------------------------------------------------(dy-sub-Σ-l)
		φ; P~ |- let Σ(∧n(x)) = [] in E[x] end : Σa:s. ˆ τ ≤ τ'

		sˆ = {a : s | P1, ..., Pn} φ |- I : sˆ φ; P~ |- E : τ [a |→ I] ≤ τ'
		---------------------------------------------------------------------(dy-sub-Π-l)
		φ; P~ |- E[⊃− n (Π−([]))] : Πa:sˆ. τ ≤ τ'

		sˆ = {a : s | P1, ..., Pn} φ |- I : sˆ φ; P~ |- E : τ ≤ τ' [a |→ I]
		---------------------------------------------------------------------(dy-sub-Σ-r)
		φ; P~ |- Σ(∧n(E)) : τ ≤ Σa:sˆ. τ'

	Fig. 21. The dynamic subtype rules in λΠ,Σ pat.
	
	図 21. λ,Π pat の動的サブタイプルール


	- Proposition 5.1
	- 命題5.1

		We have |let x = e1 in e2 end| ≤dyn |let Σ(∧n(x)) = e1 in e2 end|.
	
		`|let x = e1 in e2 end| ≤dyn |let Σ(∧n(x)) = e1 in e2 end|` です。

		- Proof
		- 証明

			This immediately follows from Lemma 2.14 and the observation that
			
			これはすぐに補題2.14と観察から、以下のことが

				|let Σ(∧n(x)) = e1 in e2 end| ,→∗g |let x = e1 in e2 end|

			holds. □

			成り立ちます。 □
