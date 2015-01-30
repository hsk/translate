# Dependent ML: An Approach to Practical

Programming with Dependent Types

Hongwei Xi∗

Boston University

(e-mail: hwxi@cs.bu.edu)

- [x] [0 Abstract](0 Abstract.md)

- [x] [1 Introduction](1 Introduction.md)

- [x] [2 λpat: A starting point](2 λpat A starting point.md)
- [x] [2.1 Static semantics](2.1 Static semantics.md)
- [x] [2.2 Dynamic semantics](2.2 Dynamic semantics.md)
- [x] [2.3 Type soundness](2.3 Type soundness.md)
- [x] [2.4 Operational equivalence](2.4 Operational equivalence.md)

- ○ [3 Type index language](3 Type index language.md)
- ○ [3.1 Regular constraint relation](3.1 Regular constraint relation.md)
- ○ [3.2 Models for type index languages](3.2 Models for type index languages.md)
- ○ [3.3 Some examples of type index languages](3.3 Some examples of type index languages.md)

- ○ [4 λ Π,Σ pat : Extending λpat with dependent types](4 λ Π,Σ pat Extending λpat with dependent types.md)
- ○ [4.1 Syntax](4.1 Syntax.md)
- ○ [4.2 Static semantics](4.2 Static semantics.md)
- ○ [4.3 Dynamic semantics](4.3 Dynamic semantics.md)
- ○ [4.4 Type soundness](4.4 Type soundness.md)
- ○ [4.5 Type index erasure](4.5 Type index erasure.md)
- ○ [4.6 Dynamic subtype relation](4.6 Dynamic subtype relation.md)
- ○ [4.7 A restricted form of dependent types](4.7 A restricted form of dependent types.md)

- ○ [5 Elaboration](5 Elaboration.md)
- ○ [5.1 The judgments and rules for elaboration](5.1 The judgments and rules for elaboration.md)
- ○ [5.2 Some explanation on synthesis elaboration rules](5.2 Some explanation on synthesis elaboration rules.md)
- ○ [5.3 Some explanation on analysis elaboration rules](5.3 Some explanation on analysis elaboration rules.md)
- ○ [5.4 The soundness of elaboration](5.4 The soundness of elaboration.md)
- ○ [5.5 Implementing elaboration](5.5 Implementing elaboration.md)

- ○ [6 Extensions](6 Extensions.md)
- ○ [6.1 Parametric polymorphism](6.1 Parametric polymorphism.md)
- ○ [6.2 Exceptions](6.2 Exceptions.md)
- ○ [6.3 References](6.3 References.md)

- ○ [7 Some programming examples](7 Some programming examples.md)
- x [7.1 Arrays](7.1 Arrays.md)
- x [7.2 Red-black trees](7.2 Red-black trees.md)
- x [7.3 A type-preserving evaluator](7.3 A type-preserving evaluator)

- x [8 Related work](8 Related work.md)

- [ ] [9 Conclusion](9 Conclusion.md)

- [ ] [A Proof of Lemma 2.14](A Proof of Lemma 2.14.md)


## lexicon 用語集

とりあえず、統一しよう

- Elaboration 推敲
	- エラボレーション
	- 使いやすくするみたいなニュアンスっぽいのだけどいちお推敲って書いてます。
	- エラボレーションってかいた方が良いのかも

- Syntax 構文
	- シンタックス

- soundness 健全性
	- サウンドネス
- Extention
	- エクステンション
	- 拡張
	- 拡張で良いよなぁ
- dependent type 依存型
	- ディペンデントタイプ
- reference 参照
	- リファレンス
- erasure 消去
	- イレイジャ
	- Javaでイレイジャってあるようなのでイレイジャの方がいい気がして来た。
- judgment 判断
	- ジャッジメント
- constraint 制約
	- コンストレイント
- the reflexive and transitive closure 反射的推移的閉包
— On the other hand 一方
- In other words いいかえれば
- Assume A. then B. Aと仮定する。そのときB。
	- 証明するときに使う
- Proof 証明
	- プルーフ
	- □ 証明終わり
- Theorem 定理
- Lemma 補題
- Define 定義 
- following 以下の
	- ... following ... : とコロンと一緒に使う事が多い。
- object language 対象言語